/*
  base.api.js: To store the base of APIs.
*/

import { ApiConstant } from "const";
import apisauce from "apisauce";
import QueryString from "qs";
import { getLocalStorage } from "utils/storage.util";
import { StorageConstant } from "const";

export const DEFAULT_API_CONFIG = {
  baseURL: ApiConstant.BASE_URL,
  headers: ApiConstant.HEADER_DEFAULT,
  timeout: ApiConstant.TIMEOUT,
  paramSerializer: params => QueryString.stringify(params, { arrayFormat: "repeat" }),
};

export const createAPI = (initConfig) => {
  initConfig = initConfig ? initConfig : DEFAULT_API_CONFIG;
  return apisauce.create(initConfig);
}

export const createAPIWithToken = (initConfig) => {
  // Set config, or just use default
  initConfig = initConfig ? initConfig : DEFAULT_API_CONFIG;
  // Get auth token from local storage
  const authToken = getLocalStorage(StorageConstant.AUTH_TOKEN);
  if (authToken !== undefined)
    initConfig.headers.Authorization = `Bearer ${authToken}`;
  return apisauce.create(initConfig);
}