import { GlobalModel } from "~/global_model";
import { loadMyAdMob } from "~/global_helper";
import { LSget, LSremove, LSdrop } from "~/local_storage_array";
import {
  ObservableArray,
  ApplicationSettings,
  Utils,
  Dialogs,
} from "@nativescript/core";
import { shareText } from "@nativescript/social-share";
import { Clipboard } from "@nativescript-use/nativescript-clipboard";
import { SnackBar } from "@nativescript-community/ui-material-snackbar";

var model = GlobalModel([]);
var context;

const dataHistory = new ObservableArray([]);
const clipboard = new Clipboard();
const snackbar = new SnackBar();

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
      /* for (let i = 0; i < data.length; i++) {
        dataHistory.push({
          name: data[i].name,
          phone: data[i].phone,
          message: data[i].message,
          country: data[i].countryName,
          flag: data[i].countryFlag,
          dateTime: data[i].dateTime,
        });
      } */
      data.forEach((item, index) => {
        // if (item.history) {
        dataHistory.push({
          name: item.name,
          phone: item.phone,
          message: item.message,
          country: item.countryName,
          flag: item.countryFlag,
          dateTime: item.dateTime,
        });
        // }
      });
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
      loadMyAdMob();
      LSdrop();
      __loadData();
      snackbar.action({
        message: "Successfully cleared history data :)",
        actionText: "X",
        textColor: "#FFFFFF",
        actionTextColor: "#FFFFFF",
        backgroundColor: "#1565C0",
        hideDelay: 2000,
      });
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
    actions: ["Go to WhatsApp", "Copy Phone Number", "Share To", "Remove"],
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

      case "COPY PHONE NUMBER":
        loadMyAdMob();
        clipboard.copy(itemTapData.phone);
        snackbar.action({
          message: itemTapData.phone + " has been copied",
          actionText: "X",
          textColor: "#333333",
          actionTextColor: "#333333",
          backgroundColor: "#FFEB3B",
          hideDelay: 2000,
        });
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
            loadMyAdMob();
            LSremove(itemIndex);
            __loadData();
            snackbar.action({
              message: itemTapData.phone + " has been removed",
              actionText: "X",
              textColor: "#FFFFFF",
              actionTextColor: "#FFFFFF",
              backgroundColor: "#1565C0",
              hideDelay: 2000,
            });
          }
        });
        break;

      default:
        break;
    }
  });
}
