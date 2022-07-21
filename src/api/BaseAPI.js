import { ApiConstant } from "const";
import apisauce from "apisauce";
import QueryString from "qs";

export const DEFAULT_API_CONFIG = {
  headers: ApiConstant.HEADER_DEFAULT,
  timeout: ApiConstant.TIMEOUT,
  baseUrl: ApiConstant.BASE_URL,
  paramSerializer: params => QueryString.stringify(params, { arrayFormat: "repeat" }),
};

export const createAPI = (initConfig) => {
  initConfig = initConfig ? initConfig : DEFAULT_API_CONFIG;
  return apisauce.create(initConfig);
}