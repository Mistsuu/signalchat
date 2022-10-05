
import StringFormat from "string-format";
import { AuthApi } from "api";
import { TxtConstant } from "const";
import { objCheckIfKeyExists } from "utils/data.util";

async function authLogin(username, password) {
  var response = await AuthApi.login({
    userID: username,
    password: password,  
  });

  if (response.ok) {
    var data = response.data;
    if (objCheckIfKeyExists(data, ["success", "data", "error"])) {
      if (!data.success)
        throw data.error;
    } else {
      throw TxtConstant.ERR_INVALID_RESPONSE_FROM_SERVER;
    }
  } else {
    throw response.problem;
  }
};

async function authRegister(username, password) {
  var response = await AuthApi.register({
    userID: username,
    password: password,
  })

  if (response.ok) {
    var data = response.data;
    if (objCheckIfKeyExists(data, ["success", "data", "error"])) {
      if (!data.success)
        throw data.error;
    } else {
      throw TxtConstant.ERR_INVALID_RESPONSE_FROM_SERVER;
    }
  } else {
    throw response.problem;
  }
};

export {
  authLogin,
  authRegister,
};