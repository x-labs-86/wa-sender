import { GlobalModel } from "~/global_model";
import { loadMyAdMob, init__tables } from "~/global_helper";
import { LSget, LSinsert, LSremove, LSdrop } from "~/local_storage_array";
import {
  ObservableArray,
  ApplicationSettings,
  Utils,
  Dialogs,
} from "@nativescript/core";
import { shareText } from "@nativescript/social-share";
import { Clipboard } from "@nativescript-use/nativescript-clipboard";
import { SnackBar } from "@nativescript-community/ui-material-snackbar";

import {
  SQL__select,
  SQL__selectRaw,
  SQL__insert,
  SQL__truncate,
  SQL__delete,
} from "~/sql_helper";

var model = GlobalModel([]);
var context;

const dataHistorySqlite = new ObservableArray([]);
const dataHistory = new ObservableArray([]);
const clipboard = new Clipboard();
const snackbar = new SnackBar();

export function onLoaded() {
  // __loadData();
  init__tables();
  __loadDataSqlite();
  loadMyAdMob();
}

export function onNavigatingTo(args) {
  const page = args.object;

  context = model;

  page.bindingContext = context;
}

// export function __loadData() {
//   const DB = LSget();
//   dataHistory.splice(0);
//   if (DB.success) {
//     const data = DB.data;
//     if (data.length > 0) {
//       data.forEach((item, index) => {
//         dataHistory.push({
//           name: item.name,
//           phone: item.phone,
//           message: item.message,
//           country: item.countryName,
//           flag: item.countryFlag,
//           dateTime: item.dateTime,
//         });
//       });
//       context.set("items", dataHistory);
//     } else {
//       context.set("items", false);
//     }
//   } else {
//     context.set("items", false);
//   }
// }

export function __loadDataSqlite() {
  dataHistorySqlite.splice(0);
  SQL__select(
    "dataphone",
    "*",
    "WHERE history=1 AND archive=0 AND contact=0"
  ).then((res) => {
    console.log("data sqlite >> ", res);
    if (res && res.length > 0) {
      res.forEach((item) => {
        dataHistorySqlite.push({
          id: item.id,
          name: item.name,
          phone: item.phone,
          message: item.message,
          country: item.country_name,
          flag: item.country_flag,
          dateTime: item.date_time,
        });
      });

      context.set("items", dataHistorySqlite);
    } else {
      context.set("items", false);
    }
  });
}

// export function __migrateToSqlite() {
//   const DB = LSget();
//   if (DB.success) {
//     const data = DB.data;
//     if (data.length > 0) {
//       console.log("data local storage >>> ", data);
//       __loadDataSqlite();
//       init__tables();
//       data.forEach((item, index) => {
//         // if (index === 0) {
//         let dataInsert = [
//           { field: "phone", value: item.phone },

//           { field: "country_name", value: item.countryName },
//           { field: "country_dial_code", value: item.countryDialCode },
//           { field: "country_flag", value: item.countryFlag },
//           { field: "country_code", value: item.countryCode },
//           { field: "date_time", value: item.dateTime },
//           { field: "archive", value: 0 },
//           { field: "contact", value: 0 },
//           { field: "history", value: 1 },
//         ];

//         if (item.name != false) {
//           dataInsert.push({ field: "name", value: item.name });
//         }
//         if (item.message != false) {
//           dataInsert.push({ field: "message", value: item.message });
//         }
//         SQL__insert("dataphone", dataInsert);
//         // }
//       });
//       __loadDataSqlite();
//     }
//   }
// }

// export function __truncate() {
//   SQL__truncate("dataphone");
//   __loadDataSqlite();
// }

// export function __dummyLocalStorageData() {
//   const dummy = [
//     {
//       guid: "3b2cf8bc-c833-4678-a1e7-906c2f4f2cc5",
//       name: false,
//       phone: "22224444",
//       message: false,
//       countryName: "Indonesia",
//       countryDialCode: "+62",
//       countryFlag: "🇮🇩",
//       countryCode: "ID",
//       dateTime: "Sunday, 5/Mei/2024 22:42:7",
//       mark: false,
//       archived: false,
//       contact: false,
//       history: true,
//     },
//     {
//       guid: "d8ac8a57-f63b-4382-a46e-c5a3412ed0df",
//       name: false,
//       phone: "2222222",
//       message: false,
//       countryName: "Indonesia",
//       countryDialCode: "+62",
//       countryFlag: "🇮🇩",
//       countryCode: "ID",
//       dateTime: "Sunday, 5/Mei/2024 22:42:4",
//       mark: false,
//       archived: false,
//       contact: false,
//       history: true,
//     },
//     {
//       guid: "fa4e6066-b0d0-4bc3-9ba6-396825033114",
//       name: false,
//       phone: "6286666666",
//       message: false,
//       countryName: "Indonesia",
//       countryDialCode: "+62",
//       countryFlag: "🇮🇩",
//       countryCode: "ID",
//       dateTime: "Sunday, 5/Mei/2024 21:16:28",
//       mark: false,
//       archived: false,
//       contact: false,
//       history: true,
//     },
//     {
//       guid: "d8bd6bf4-4af6-40b2-8429-f8c1dd48e2d6",
//       name: false,
//       phone: "628999999997",
//       message: false,
//       countryName: "Indonesia",
//       countryDialCode: "+62",
//       countryFlag: "🇮🇩",
//       countryCode: "ID",
//       dateTime: "Sunday, 5/Mei/2024 21:15:55",
//       mark: false,
//       archived: false,
//       contact: false,
//       history: true,
//     },
//     {
//       guid: "a7d93983-e359-4c74-a54d-ed67bc53b441",
//       name: false,
//       phone: "6289999999",
//       message: false,
//       countryName: "Indonesia",
//       countryDialCode: "+62",
//       countryFlag: "🇮🇩",
//       countryCode: "ID",
//       dateTime: "Sunday, 5/Mei/2024 21:15:42",
//       mark: false,
//       archived: false,
//       contact: false,
//       history: true,
//     },
//     {
//       guid: "4e308741-417c-4eb0-af02-b7f221556891",
//       name: false,
//       phone: "62811223344",
//       message: false,
//       countryName: "Indonesia",
//       countryDialCode: "+62",
//       countryFlag: "🇮🇩",
//       countryCode: "ID",
//       dateTime: "Sunday, 5/Mei/2024 20:53:39",
//       mark: false,
//       archived: false,
//       contact: false,
//       history: true,
//     },
//     {
//       guid: "5bfc6d8f-b144-436e-811f-0a3760895263",
//       name: false,
//       phone: "62811111111",
//       message: false,
//       countryName: "Indonesia",
//       countryDialCode: "+62",
//       countryFlag: "🇮🇩",
//       countryCode: "ID",
//       dateTime: "Sunday, 5/Mei/2024 20:52:49",
//       mark: false,
//       archived: false,
//       contact: false,
//       history: true,
//     },
//     {
//       guid: "9d89676e-f853-4e2b-a58a-2191d9e1c899",
//       name: false,
//       phone: "62811111110",
//       message: false,
//       countryName: "Indonesia",
//       countryDialCode: "+62",
//       countryFlag: "🇮🇩",
//       countryCode: "ID",
//       dateTime: "Sunday, 5/Mei/2024 20:51:36",
//       mark: false,
//       archived: false,
//       contact: false,
//       history: true,
//     },
//     {
//       guid: "7e8583ce-2719-4a74-a3c0-afe48c0754ac",
//       name: false,
//       phone: "6281111111",
//       message: false,
//       countryName: "Indonesia",
//       countryDialCode: "+62",
//       countryFlag: "🇮🇩",
//       countryCode: "ID",
//       dateTime: "Sunday, 5/Mei/2024 20:50:28",
//       mark: false,
//       archived: false,
//       contact: false,
//       history: true,
//     },
//   ];

//   dummy.forEach((item) => {
//     const dataInsert = {
//       guid: item.guid,
//       name: item.name,
//       phone: item.phone,
//       message: item.message,
//       countryName: item.countryName,
//       countryDialCode: item.countryDialCode,
//       countryFlag: item.countryFlag,
//       countryCode: item.countryCode,
//       dateTime: item.dateTime,
//       mark: item.mark,
//       archived: item.archived,
//       contact: item.contact,
//       history: item.history,
//     };
//     LSinsert(dataInsert);
//   });
// }

export function clearTap() {
  Dialogs.confirm({
    title: "Clear data history",
    message: "Are you sure you want to do this?",
    okButtonText: "Yes",
    neutralButtonText: "No",
  }).then((result) => {
    if (result) {
      loadMyAdMob();
      // LSdrop();
      SQL__delete("dataphone", null, "WHERE history=1");
      // SQL__truncate("dataphone");
      __loadDataSqlite();
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
  // __loadData();
  __loadDataSqlite();
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
        const confirmOptions = {
          title: "Confirm",
          message: "Are you sure want to remove this item?",
          okButtonText: "Yes",
          neutralButtonText: "No",
        };
        confirm(confirmOptions).then((result) => {
          if (result === true) {
            loadMyAdMob();
            // LSremove(itemIndex);
            SQL__delete("dataphone", itemTapData.id);
            __loadDataSqlite();
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
