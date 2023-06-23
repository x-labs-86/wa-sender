import { GlobalModel } from "~/global_model";
import { countryList } from "~/global_helper";
import {
  ApplicationSettings,
  Utils,
  Observable,
  PropertyChangeData,
  SearchBar,
} from "@nativescript/core";

var model = GlobalModel([]);
var context, framePage;

export function onLoaded(args) {
  framePage = args.object.frame;
  ApplicationSettings.setString("CONFIG_URL", "whatsapp://send?phone=");
}

export function onNavigatingTo(args) {
  const page = args.object;

  context = model;

  context.set("items", countryList());
  context.set("keyword", "");

  page.bindingContext = context;
}

export function onItemTap(args) {
  let itemTap = args.view;
  let itemTapData = itemTap.bindingContext;

  ApplicationSettings.setString("CONFIG_COUNTRY_CODE", itemTapData.dial_code);
  ApplicationSettings.setString(
    "CONFIG_COUNTRY_CODE_DATA",
    JSON.stringify(itemTapData)
  );
  ApplicationSettings.setBoolean("HAS_SETUP", true);

  framePage.navigate({
    moduleName: "home/home-page",
    animated: true,
    clearHistory: true,
    transition: {
      name: "fade",
    },
  });
}

export function home() {
  framePage.navigate({
    moduleName: "home/home-page",
    animated: true,
    clearHistory: true,
    transition: {
      name: "fade",
    },
  });
}

export function onSubmit(args) {
  const searchBar = args.object;
  const cl = countryList();
  const filter = cl.filter(
    (item) =>
      item &&
      item.name &&
      item.name.toLowerCase().includes(searchBar.text.toLowerCase())
  );
  context.set("items", filter);
}

export function onClear() {
  context.set("items", countryList());
  context.set("keyword", "");
}
