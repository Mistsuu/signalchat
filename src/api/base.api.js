/*
  base.api.js: To store the base of APIs.
*/

import { ApiConstant } from "const";
import apisauce from "apisauce";
import QueryString from "qs";

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
  initConfig = initConfig ? initConfig : DEFAULT_API_CONFIG;
  initConfig.headers.Authorization = "Bearer fuckyou123";
  return apisauce.create(initConfig);
}