import { GlobalModel } from "~/global_model";
import { Utils } from "@nativescript/core";

var model = GlobalModel([]);
var context;

export function onNavigatingTo(args) {
  const page = args.object;

  context = model;

  page.bindingContext = context;
}

export function rateNow() {
  Utils.openUrl(
    "https://play.google.com/store/apps/details?id=com.kang.cahya.apps.whatsappsender"
  );
}

export function reportNow() {
  Utils.openUrl(
    "mailto:kangcahyakeren@gmail.com?subject=Bugs Report - WA Sender Apps"
  );
}
