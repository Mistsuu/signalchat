"use strict";
const { contextBridge } = require("electron");

// Clear everything in localStorage
localStorage.clear();

// ------------------------------ EXPOSED ELECTRON APIS ------------------------------
contextBridge.exposeInMainWorld("SignalConstant", {
  app: {
    ...require("./const/app.const")
  },
  system: {
    ...require("./const/system.const")
  },
  native: {
    ...require("./const/native.const")
  },
  storage: {
    ...require("./const/storage.const")
  },
  api: {
    ...require("./const/api.const")
  },
})

contextBridge.exposeInMainWorld("interactor", {
  app: {
    ...require("./interactor/app.interactor")
  },
  crypto: {
    ...require("./interactor/crypto.interactor")
  },
})