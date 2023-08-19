import { Application } from "@nativescript/core";
import { firebase } from "@nativescript/firebase-core";
import { Admob } from "@nativescript/firebase-admob";

Application.run({ moduleName: "app-root" });
firebase().initializeApp();
Admob.init();

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
