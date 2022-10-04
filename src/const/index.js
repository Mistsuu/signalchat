"use strict";
const deepCloneJsonObject = json => {
  if (!json) return null;
  return JSON.parse(JSON.stringify(json));
};
const AppConstant = deepCloneJsonObject(window.SignalConstant.app);
const SystemConstant = deepCloneJsonObject(window.SignalConstant.system);
const NativeConstant = deepCloneJsonObject(window.SignalConstant.native);
const StorageConstant = deepCloneJsonObject(window.SignalConstant.storage);
const ApiConstant = deepCloneJsonObject(window.SignalConstant.api);
const QueryConstant = deepCloneJsonObject(window.SignalConstant.query);
const PathConstant = deepCloneJsonObject(window.SignalConstant.path);

export {
  AppConstant,
  SystemConstant,
  NativeConstant,
  StorageConstant,
  ApiConstant,
  QueryConstant,
  PathConstant,
};