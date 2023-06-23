import { ObservableArray } from "@nativescript/core";

export function GlobalModel(items) {
  var arr = new ObservableArray(items);

  return arr;
}
