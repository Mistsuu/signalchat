"use strict";
const deepCloneJsonObject = json => {
  if (!json) return null;
  return JSON.parse(JSON.stringify(json));
};
const AppConstant = deepCloneJsonObject(window.SignalConstant.app);

export {
  AppConstant
};