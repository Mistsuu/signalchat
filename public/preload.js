"use strict";
const { contextBridge } = require("electron");

// Initialize data
// const { preloadInit } = require("./interactor/preload_init.interactor")
// preloadInit();

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
  query: {
    ...require("./const/query.const")
  },
  path: {
    ...require("./const/path.const")
  },
  txt: {
    ...require("./const/txt.const")
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