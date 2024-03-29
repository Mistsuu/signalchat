import StringFormat from "string-format";
import { boolean, mixed, object, string } from "yup";
import { TxtConstant, ApiConstant } from "const";

export const parseResponse = (responseSchema, response) => {
  /*
  *   Parse packets and return in a 
  *   {
  *      error: string,
  *      data: whatever
  *   } format.
  */  
  
  var error = "";
  var responseData = null;
  var returnSchema = object({
    error: string().default(""),
    responseData: mixed(),
  });

  if (response.problem === ApiConstant.PROB_NONE) {
    try {
      responseData = responseSchema.validateSync(response.data)
    } catch (err) {
      error = StringFormat(TxtConstant.FM_REQUEST_ERROR, TxtConstant.ERR_INVALID_RESPONSE_FROM_SERVER);
    }
  } else if (response.problem === ApiConstant.PROB_CLIENT_ERROR) {
    try {
      responseData = responseSchema.validateSync(response.data)
      if (response.hasOwnProperty("data") && response.data.hasOwnProperty("error"))
        error = response.data.error ? response.data.error : TxtConstant.ERR_UNKNOWN_ERROR_FROM_CLIENT;
      else 
        error = TxtConstant.ERR_UNKNOWN_ERROR_FROM_CLIENT;
    } catch (err) {
      error = StringFormat(TxtConstant.FM_REQUEST_ERROR, TxtConstant.ERR_INVALID_RESPONSE_FROM_SERVER);
    }
  } else if (response.problem === ApiConstant.PROB_SERVER_ERROR) {
    error = TxtConstant.ERR_UNKNOWN_ERROR_FROM_SERVER;
  } else if (response.problem === ApiConstant.PROB_TIMEOUT_ERROR) {
    error = TxtConstant.ERR_REQUEST_IS_TIMEOUT;
  } else if (response.problem === ApiConstant.PROB_CONNECTION_ERROR) {
    error = TxtConstant.ERR_CANNOT_CONNECT_TO_SERVER;
  } else if (response.problem === ApiConstant.PROB_NETWORK_ERROR) {
    error = TxtConstant.ERR_NETWORK_IS_NOT_AVAILIBLE;
  } else if (response.problem === ApiConstant.PROB_CANCEL_ERROR) {
    error = TxtConstant.ERR_REQUEST_HAS_BEEN_CANCELLED;
  } else {
    error = TxtConstant.ERR_UNKNOWN_ERROR;
  }

  return returnSchema.cast({
    error: error,
    responseData: responseData,
  })
}