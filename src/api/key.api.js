import { ApiConstant } from "const";
import { createAPIWithToken } from "./base.api";

export const initKeys = data => createAPIWithToken().post(ApiConstant.API_INITKEY, data);
export const updateOnetimePrekeys = data => createAPIWithToken().post(ApiConstant.API_UPDATEONETIME, data);
export const checkKeyStatus = () => createAPIWithToken().get(ApiConstant.API_CHECKKEYSTATUS);