"use strict";
const { contextBridge } = require("electron");

// ------------------------------ EXPOSED ELECTRON APIS ------------------------------

contextBridge.exposeInMainWorld("SignalConstant", {
  app: {
    ...require("./const/app.const")
  }
})