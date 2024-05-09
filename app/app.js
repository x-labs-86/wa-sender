import { Application } from "@nativescript/core";
import { Theme } from "@nativescript/theme";
import { firebase } from "@nativescript/firebase-core";
import { Admob, InterstitialAd } from "@nativescript/firebase-admob";

import { themer } from "@nativescript-community/ui-material-core";
import { installMixins } from "@nativescript-community/ui-material-core";

themer.setPrimaryColor("#40aeff");
themer.setAccentColor("#E3F2FD");
themer.setSecondaryColor("#FAFAFA");

installMixins();

Theme.setMode(Theme.Light); // Theme.Dark Or Theme.Light
await firebase().initializeApp();
Admob.init();

Application.run({ moduleName: "app-root" });
/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
