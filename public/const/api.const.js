// Common
const BASE_URL = "http://172.16.88.158:1208";
const HEADER_DEFAULT = {
  Accept: "application/json",
};
const TIMEOUT = 5000;

// HTTP Status
const STT_OK = 200;
const STT_BAD_REQUEST = 400;
const STT_UNAUTHORIZED = 401;
const STT_FORBIDDEN = 403;
const STT_NOT_FOUND = 404;
const STT_INTERNAL_SERVER = 500;

// API
const API_TEST = "/test";
const API_LOGIN = "/login";
const API_REGISTER = "/register";

module.exports = {
  // Common
  BASE_URL,
  HEADER_DEFAULT,
  TIMEOUT,
  // HTTP Status
  STT_OK,
  STT_BAD_REQUEST,
  STT_UNAUTHORIZED,
  STT_FORBIDDEN,
  STT_NOT_FOUND,
  STT_INTERNAL_SERVER,
  // API
  API_TEST,
  API_LOGIN,
  API_REGISTER,
};