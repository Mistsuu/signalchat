import { ApiConstant } from "const";
import { createAPI, createAPIWithToken } from "./base.api";

export const login = data => createAPI().post(ApiConstant.API_LOGIN, data);
export const register = data => createAPI().post(ApiConstant.API_REGISTER, data);