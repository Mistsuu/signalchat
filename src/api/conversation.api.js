import StringFormat from "string-format";
import { ApiConstant } from "const";
import { createAPIWithToken } from "./base.api";

export const sendMessage = (userID, data) => createAPIWithToken().put(StringFormat(ApiConstant.API_SENDMESSAGES, userID), data);
export const fetchMessages = () => createAPIWithToken().get(ApiConstant.API_FETCHMESSAGES);
export const clearMessages = () => createAPIWithToken().delete(ApiConstant.API_CLEARMESSAGES);