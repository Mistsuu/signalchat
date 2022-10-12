import StringFormat from "string-format";
import { ApiConstant } from "const";
import { createAPIWithToken } from "./base.api";

export const sendMessage = (userID, targetUserID, data) => createAPIWithToken().put(StringFormat(ApiConstant.API_SENDMESSAGES, targetUserID, userID), data);
export const fetchMessages = () => createAPIWithToken().get(ApiConstant.API_FETCHMESSAGES);
export const clearMessages = () => createAPIWithToken().delete(ApiConstant.API_CLEARMESSAGES);
export const fetchUsers = () => createAPIWithToken().get(ApiConstant.API_FETCHUSERS);