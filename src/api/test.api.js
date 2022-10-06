import { ApiConstant } from "const";
import { createAPI, createAPIWithToken } from "./base.api";

export const testGet = data => createAPI().get(ApiConstant.API_TEST, data);
export const testPost = data => createAPI().post(ApiConstant.API_TEST, data);
export const testAuthorizationGet = data => createAPIWithToken().post(ApiConstant.API_TEST, data);
export const testAuthorizationPost = data => createAPIWithToken().post(ApiConstant.API_TEST, data);