"use strict";
const { contextBridge } = require("electron");

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

contextBridge.exposeInMainWorld("SignalInteractor", {
  app: {
    ...require("./interactor/app.interactor")
  },
  crypto: {
    ...require("./interactor/crypto.interactor")
  },
})

contextBridge.exposeInMainWorld("SignalModel", {
  Prekey: require("./models/prekey.model"),
  Session: require("./models/session.model"),
  Message: require("./models/message.model"),
  Device: require("./models/device.model"),
  Cipher: require("./models/cipher.model"),
})