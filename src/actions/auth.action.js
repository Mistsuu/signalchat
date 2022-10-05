
import StringFormat from "string-format";
import { object, string, boolean, array } from "yup";
import { AuthApi } from "api";
import { TxtConstant } from "const";
import { objCheckIfKeyExists } from "utils/data.util";

async function authLogin(data) {
  // Create schemas
  let requestSchema = object({
    userID: string().required(),
    deviceID: string().required(),
    password: string().required(),
  });

  let responseSchema = object({
    success: boolean().required(),
    error: string().required().default(""),
  });

  // Send data
  var request = requestSchema.cast({
                  userID: data.username,
                  deviceID: data.deviceID,
                  password: data.password,
                });
  var response = await AuthApi.login(request);

  // Check output
  var success = false;
  var error = "";
  if (response.ok) {
    try {
      await responseSchema.validate(response.data);
    } catch (err) {
      error = StringFormat(TxtConstant.FM_REQUEST_ERROR, TxtConstant.ERR_INVALID_RESPONSE_FROM_SERVER);
    }
  } else {
    error = StringFormat(TxtConstant.FM_REQUEST_ERROR, response.problem);
  }

  return responseSchema.cast({
    success: success,
    error: error,
  });
};

async function authRegister(data) {
  // Create schemas
  let requestSchema = object({
    userID: string().required(),
    password: string().required(),
  });

  let responseSchema = object({
    success: boolean().required(),
    success: string().default(),
  });

  // Send data
  var request = requestSchema.cast({
                  userID: data.username,
                  password: data.password,
                });
  var response = await AuthApi.login(request);

  // Check output
  var success = false;
  var error = "";
  if (response.ok) {
    try {
      var data = await responseSchema.validate(response.data);
      return data;
    } catch (err) {
      error = StringFormat(TxtConstant.FM_REQUEST_ERROR, TxtConstant.ERR_INVALID_RESPONSE_FROM_SERVER);
    }
  } else {
    error = StringFormat(TxtConstant.FM_REQUEST_ERROR, response.problem);
  }

  return responseSchema.cast({
    success: success,
    error: error,
  });
};

export {
  authLogin,
  authRegister,
};