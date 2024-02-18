import { Application } from "@nativescript/core";
import { firebase } from "@nativescript/firebase-core";
import { Admob, InterstitialAd } from "@nativescript/firebase-admob";

await firebase().initializeApp();
Admob.init();

Application.run({ moduleName: "app-root" });
/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
