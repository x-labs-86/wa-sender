import { NativeScriptConfig } from "@nativescript/core";

export default {
  id: "com.kang.cahya.apps.wasender",
  appPath: "app",
  appResourcesPath: "App_Resources",
  webpackConfigPath: "webpack.config.js",
  android: {
    discardUncaughtJsExceptions: true,
    codeCache: true,
    v8Flags: "--nolazy --expose_gc",
    markingMode: "none",
  },
} as NativeScriptConfig;
