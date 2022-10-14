import { ApiConstant } from "const";
import { createAPI, createAPIWithToken } from "./base.api";

export const login = data => createAPI().post(ApiConstant.API_LOGIN, data);
export const logout = data => createAPIWithToken().post(ApiConstant.API_LOGOUT, data);
export const register = data => createAPI().post(ApiConstant.API_REGISTER, data);