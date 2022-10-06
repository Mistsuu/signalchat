import StringFormat from "string-format";
import { object, string, boolean, array } from "yup";
import { AuthApi } from "api";
import { TxtConstant } from "const";
import { getDeviceID } from "utils/storage.util";

async function authLogin(data) {
  // Create schemas
  let requestSchema = object({
    userID: string().required(),
    deviceID: string().default(getDeviceID()), // TODO: Change it to getLocalStorage(DEVICE_ID), requiring set the value at initialization.
    password: string().required(),
  });

  let responseSchema = object({
    success: boolean().required(),
    error: string().default(""),
    token: string().default(""),
  })

  // Send data
  var request = await requestSchema.validate(data);
  var response = await AuthApi.login(request);

  // Check output
  var success = false;
  var error = "";
  var token = "";
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
    token: token,
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
    error: string().default(),
  });

  // Send data
  var request = await requestSchema.validate(data);
  var response = await AuthApi.register(request);

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