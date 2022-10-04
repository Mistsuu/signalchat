const {
  getLocalStorage,
  setLocalStorage,
} = require("../utils/storage.util");

const {
  randomBufHex
} = require("../utils/buffer.util");

const {
  StorageConstant
} = require("../const");

const initDeviceId = () => {
  if (!getLocalStorage(StorageConstant.DEVICE_ID))
    setLocalStorage(StorageConstant.DEVICE_ID, randomBufHex(32));
}

const initLoginState = () => {
  if (getLocalStorage(StorageConstant.IS_LOGGED_IN) == undefined)
    setLocalStorage(StorageConstant.IS_LOGGED_IN, false);
}

const preloadInit = () => {
  initDeviceId();
  initLoginState();
}

module.exports = {
  preloadInit,
}