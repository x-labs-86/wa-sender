import { Application, isAndroid, Utils } from "@nativescript/core";
import { Theme } from "@nativescript/theme";
import { firebase } from "@nativescript/firebase-core";
import { Admob } from "@nativescript/firebase-admob";

if (isAndroid) {
  const WebView = require("@nativescript/core/ui/web-view").WebView;
  WebView.prototype.createNativeView = function () {
    const webView = new Utils.android.webkit.WebView(Utils.android.context);
    webView.setWebContentsDebuggingEnabled(true);
    webView.getSettings().setJavaScriptEnabled(true);
    webView.getSettings().setAllowFileAccess(true);
    webView.getSettings().setDomStorageEnabled(true);
    webView.getSettings().setSupportZoom(true); // Enable zoom support
    webView.getSettings().setUseWideViewPort(true); // Use wide viewport
    webView.getSettings().setLoadWithOverviewMode(true); // Load with overview mode
    return webView;
  };
}

Theme.setMode(Theme.Light); // Theme.Dark Or Theme.Light
await firebase().initializeApp();
Admob.init();

Application.run({ moduleName: "app-root" });
/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
