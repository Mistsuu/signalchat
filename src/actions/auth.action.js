import { object, string } from "yup";
import { AuthApi } from "api";
import { parseResponse } from "utils/api.util";
import { DeviceModel, MessageModel, PrekeyModel, SessionModel } from "models";

export async function authLogin(data) {
  // Create schemas
  let requestSchema = object({
    userID: string().required(),
    password: string().required(),
  });

  let responseSchema = object({
    error: string().default(""),
    token: string().default(""),
    deviceID: string().default(""),
    userID: string().default(""),
  })

  // Send data
  var request = requestSchema.validateSync(data);
  var response = await AuthApi.login(request);

  // Check output
  var {
    error, 
    responseData,
  } = parseResponse(responseSchema, response);

  return {
    error: error,
    token: !error ? responseData.token : "",
    userID: !error ? responseData.userID : "",
    deviceID: !error ? responseData.deviceID : "",
  };
};

export async function authRegister(data) {
  // Create schemas
  let requestSchema = object({
    userID: string().required(),
    password: string().required(),
  });

  let responseSchema = object({
    error: string().default(""),
  });

  // Send data
  var request = requestSchema.validateSync(data);
  var response = await AuthApi.register(request);

  // Check output
  var {
    error, 
    responseData,
  } = parseResponse(responseSchema, response);

  return {
    error: error
  };
};

export async function authLogout() {
  // Clear database files
  PrekeyModel.dropAll();
  MessageModel.dropAll();
  DeviceModel.dropAll();
  SessionModel.dropAll();
}