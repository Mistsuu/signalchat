"use strict";
const deepCloneJsonObject = json => {
  if (!json) return null;
  return JSON.parse(JSON.stringify(json));
};
const AppConstant = deepCloneJsonObject(window.SignalConstant.app);
const SystemConstant = deepCloneJsonObject(window.SignalConstant.system);

export {
  AppConstant,
  SystemConstant
};