import { GlobalModel } from "~/global_model";
import {
  fixingPhoneNumberFormat,
  getCurrentTime,
  generateUUID,
  loadMyAdMob,
} from "~/global_helper";
import { LSinsert } from "~/local_storage_array";
import { ApplicationSettings, Utils } from "@nativescript/core";

var model = GlobalModel([]);
var context, framePage, currentCountry;

export function onLoaded(args) {
  framePage = args.object.frame;
  loadMyAdMob();
  // __loadAdmob();

  if (!ApplicationSettings.hasKey("HAS_SETUP")) {
    const defaultSettings = {
      name: "Indonesia",
      dial_code: "+62",
      code: "ID",
      flag: "🇮🇩",
    };

    ApplicationSettings.setString("CONFIG_COUNTRY_CODE", "+62");
    ApplicationSettings.setString(
      "CONFIG_COUNTRY_CODE_DATA",
      JSON.stringify(defaultSettings)
    );
    ApplicationSettings.setBoolean("HAS_SETUP", true);
  }
  /* 
        Universal Links : https://wa.me/
        Custom URL Scheme : whatsapp://

        More information you can open link below :
        https://faq.whatsapp.com/iphone/how-to-link-to-whatsapp-from-a-different-app/?lang=en    
    */

  ApplicationSettings.setString("CONFIG_URL", "whatsapp://send?phone=");
}

export function onNavigatingTo(args) {
  const page = args.object;

  context = model;

  context.set("countryName", "");
  context.set("countryDialCode", "");
  context.set("countryFlag", "");
  context.set("hint_text", "Type WhatsApp Number...");
  context.set("phone_number", "");

  setTimeout(() => {
    __parseCountry();
  }, 700);

  page.bindingContext = context;
}

export function __parseCountry() {
  try {
    const configCountry = ApplicationSettings.getString(
      "CONFIG_COUNTRY_CODE_DATA"
    );
    currentCountry = JSON.parse(configCountry);

    context.set("countryName", currentCountry.name);
    context.set("countryDialCode", currentCountry.dial_code);
    context.set("countryFlag", currentCountry.flag);
    context.set("hint_text", "Type Phone Number...");
    context.set("phone_number", "");
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
}

export function openApps() {
  const configUrl = ApplicationSettings.getString("CONFIG_URL");
  const phoneNumber = fixingPhoneNumberFormat(
    context.phone_number,
    currentCountry.dial_code
  );
  const fullUrl = configUrl + phoneNumber;

  Utils.openUrl(fullUrl);
  const dataInsert = {
    guid: generateUUID(),
    name: false,
    phone: phoneNumber,
    message: false,
    countryName: currentCountry.name,
    countryDialCode: currentCountry.dial_code,
    countryFlag: currentCountry.flag,
    countryCode: currentCountry.code,
    dateTime: getCurrentTime(),
    mark: false,
    archived: false,
    contact: false,
    history: true,
  };
  LSinsert(dataInsert);

  context.set("phone_number", "");
}

export function changeCountry() {
  framePage.navigate({
    moduleName: "home/change-country/change-country-page",
    animated: true,
    transition: { name: "fade" },
  });
}
