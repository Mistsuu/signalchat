"use strict";
const { contextBridge } = require("electron");

// ------------------------------ EXPOSED ELECTRON APIS ------------------------------

contextBridge.exposeInMainWorld("SignalConstant", {
  app: {
    ...require("./const/app.const")
  },
  system: {
    ...require("./const/system.const")
  }
})

contextBridge.exposeInMainWorld("interactor", {
  app: {
    ...require("./interactor/app.interactor")
  }
})