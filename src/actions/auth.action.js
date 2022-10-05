
import StringFormat from "string-format";
import { AuthApi } from "api";
import { TxtConstant } from "const";
import { objCheckIfKeyExists } from "utils/data.util";

async function authLogin(data) {
  var response = await AuthApi.login({
    userID: data.username,
    deviceID: "to-be-filled", // TODO: filling this device id?
    password: data.password,
  });

  var loginOK = false;
  var error = null;

  if (response.ok) {
    var data = response.data;
    if (objCheckIfKeyExists(data, ["success", "error"])) {
      if (!data.success)
        error = data.error;
      else
        loginOK = true;
    } else {
      error = StringFormat(TxtConstant.FM_REQUEST_ERROR, TxtConstant.ERR_INVALID_RESPONSE_FROM_SERVER);
    }
  } else {
    error = StringFormat(TxtConstant.FM_REQUEST_ERROR, response.problem);
  }

  return {
    success: loginOK,
    error: error
  }
};

async function authRegister(data) {
  var response = await AuthApi.register({
    userID: data.username,
    password: data.password,
  });

  var registerOK = false;
  var error = null;

  if (response.ok) {
    var data = response.data;
    if (objCheckIfKeyExists(data, ["success", "error"])) {
      if (!data.success)
        error = data.error;
      else
        registerOK = true;
    } else {
      error = StringFormat(TxtConstant.FM_REQUEST_ERROR, TxtConstant.ERR_INVALID_RESPONSE_FROM_SERVER);
    }
  } else {
    error = StringFormat(TxtConstant.FM_REQUEST_ERROR, response.problem);
  }

  return {
    success: registerOK,
    error: error
  }
};

export {
  authLogin,
  authRegister,
};