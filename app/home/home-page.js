import {
  ApplicationSettings,
  Utils,
  Dialogs,
  knownFolders,
  Folder,
  path,
} from "@nativescript/core";
import { GlobalModel } from "~/global_model";
import {
  fixingPhoneNumberFormat,
  getCurrentTime,
  loadMyAdMob,
  init__tables,
} from "~/global_helper";
import { LSget, LSdrop } from "~/local_storage_array";
import { SQL__insert } from "~/sql_helper";

var model = GlobalModel([]);
var context, framePage, currentCountry;

export function onLoaded(args) {
  framePage = args.object.frame;

  _createDirectories();
  __autoMigrateToSqlite();

  setTimeout(() => {
    loadMyAdMob();
  }, 500);

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

  if (!phoneNumber) {
    Dialogs.alert("Please enter a phone number!");
    return;
  }

  if (phoneNumber.trim() == "") {
    Dialogs.alert("Please enter a phone number!");
    return;
  }

  if (phoneNumber == undefined) {
    Dialogs.alert("Please enter a phone number!");
    return;
  }

  Utils.openUrl(fullUrl);
  /* const dataInsert = {
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
  LSinsert(dataInsert); */

  // console.log("Insert >> ", dataInsert);
  init__tables();
  const data = [
    { field: "phone", value: phoneNumber },
    { field: "country_name", value: currentCountry.name },
    { field: "country_dial_code", value: currentCountry.dial_code },
    { field: "country_flag", value: currentCountry.flag },
    { field: "country_code", value: currentCountry.code },
    { field: "date_time", value: getCurrentTime() },
  ];
  SQL__insert("dataphone", data);

  context.set("phone_number", "");
}

export function changeCountry() {
  framePage.navigate({
    moduleName: "home/change-country/change-country-page",
    animated: true,
    transition: { name: "fade" },
  });
}

export function __autoMigrateToSqlite() {
  const DB = LSget();
  if (DB.success) {
    const data = DB.data;
    if (data.length > 0) {
      // console.log("data local storage >>> ", data);
      init__tables();
      data.forEach((item) => {
        let dataInsert = [
          { field: "phone", value: item.phone },
          { field: "country_name", value: item.countryName },
          { field: "country_dial_code", value: item.countryDialCode },
          { field: "country_flag", value: item.countryFlag },
          { field: "country_code", value: item.countryCode },
          { field: "date_time", value: item.dateTime },
          { field: "archive", value: 0 },
          { field: "contact", value: 0 },
          { field: "history", value: 1 },
        ];

        if (item.name != false) {
          dataInsert.push({ field: "name", value: item.name });
        }
        if (item.message != false) {
          dataInsert.push({ field: "message", value: item.message });
        }
        SQL__insert("dataphone", dataInsert);
      });

      LSdrop();

      /* console.log("data local storage after migrate >>> ", LSget());
      SQL__select(
        "dataphone",
        "*",
        "WHERE history=1 AND archive=0 AND contact=0"
      ).then((res) => {
        console.log("data sqlite >>> ", res);
      }); */
    }
  }
}

export function upgradeToPro(args) {
  Utils.openUrl(
    "https://play.google.com/store/apps/details?id=com.kang.cahya.apps.whatsappsenderpro"
  );
}

export function bannerAdLoaded(args) {
  // console.log("args", args);
}

function _createDirectories() {
  const cacheFolderPath = path.join(
    knownFolders.temp().path,
    "WebView/Crashpad"
  );

  const cacheFolder = Folder.fromPath(cacheFolderPath);
  // console.log("Checking if Crashpad directory exists...");
  cacheFolder
    .getEntities()
    .then((entities) => {
      // console.log(
      //   "Crashpad directory exists, entities found: " + entities.length
      // );
    })
    .catch((error) => {
      // console.log("Crashpad directory does not exist, creating directory...");
      // Folder.fromPath(cacheFolderPath);
      // console.log("Crashpad directory created successfully");
    });
}
