import { GlobalModel } from "~/global_model";
import { LSget, LSremove, LSdrop } from "~/local_storage_array";
import {
  ObservableArray,
  ApplicationSettings,
  Utils,
  Dialogs,
} from "@nativescript/core";
import { shareText } from "@nativescript/social-share";

var model = GlobalModel([]);
var context;

const dataHistory = new ObservableArray([]);

export function onLoaded() {
  __loadData();
}

export function onNavigatingTo(args) {
  const page = args.object;

  context = model;

  page.bindingContext = context;
}

export function __loadData() {
  const DB = LSget();
  dataHistory.splice(0);
  if (DB.success) {
    const data = DB.data;
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        dataHistory.push({
          phone: data[i].phone,
          flag: data[i].countryFlag,
          dateTime: data[i].dateTime,
        });
      }
      context.set("items", dataHistory);
    } else {
      context.set("items", false);
    }
  } else {
    context.set("items", false);
  }
}

export function clearTap() {
  confirm({
    title: "Clear data history",
    message: "Are you sure you want to do this?",
    okButtonText: "Yes",
    neutralButtonText: "No",
  }).then((result) => {
    if (result) {
      LSdrop();
      __loadData();
      alert("Successfully cleared history data :)");
    }
  });
}

export function refreshTap() {
  __loadData();
}

export function onItemTap(args) {
  let itemIndex = args.index;
  let itemTap = args.view;
  let itemTapData = itemTap.bindingContext;

  const actionOptions = {
    title: "Actions for " + itemTapData.phone,
    message: "",
    cancelButtonText: "Cancel",
    actions: ["Go to WhatsApp", "Share To", "Remove"],
    cancelable: true, // Android only
  };

  Dialogs.action(actionOptions).then((result) => {
    const __RU = result.toUpperCase();
    switch (__RU) {
      case "GO TO WHATSAPP":
        let configUrl = ApplicationSettings.getString("CONFIG_URL");
        let phoneNumber = itemTapData.phone;
        let fullUrl = configUrl + phoneNumber;
        Utils.openUrl(fullUrl);
        break;

      case "SHARE TO":
        shareText(itemTapData.phone);
        break;

      case "REMOVE":
        confirm({
          title: "Confirm",
          message: "Are you sure want to remove this item?",
          okButtonText: "Yes",
          neutralButtonText: "No",
        }).then((result) => {
          if (result === true) {
            LSremove(itemIndex);
            __loadData();
            alert(itemTapData.phone + " has been removed");
          }
        });
        break;

      default:
        break;
    }
  });
}
