import StringFormat from "string-format";
import { ApiConstant } from "const";
import { createAPIWithToken } from "./base.api";

export const sendMessage = (userID, data) => createAPIWithToken().post(StringFormat(ApiConstant.API_SEND, userID), data);