// Common
const BASE_URL = "http://172.16.88.158:1208";
const HEADER_DEFAULT = {
  Accept: "application/json",
};
const TIMEOUT = 45000;

// HTTP Status
const STT_OK = 200;
const STT_BAD_REQUEST = 400;
const STT_UNAUTHORIZED = 401;
const STT_FORBIDDEN = 403;
const STT_NOT_FOUND = 404;
const STT_NOT_ACCEPTABLE = 406;
const STT_CONFLICT = 409;
const STT_GONE = 410;
const STT_INTERNAL_SERVER = 500;

// API
const API_TEST = "/test";
const API_TESTAUTH = "/test-auth";

const API_LOGIN = "/login";
const API_REGISTER = "/register";

const API_INITKEY = "/initkey";
const API_GETKEY = "/getkey/{0}/{1}";
const API_UPDATEONETIME = "/updateOneTime";
const API_CHECKKEYSTATUS = "/checkKeyStatus";

const API_SENDMESSAGES = "/sendMessages/{0}/{1}";
const API_FETCHMESSAGES = "/fetchMessages";
const API_CLEARMESSAGES = "/clearMessages";

const API_FETCHUSERS = "/fetchUsers"

// Problems (throw by APISauce)
const PROB_NONE = null;
const PROB_CLIENT_ERROR = "CLIENT_ERROR";
const PROB_SERVER_ERROR = "SERVER_ERROR";
const PROB_TIMEOUT_ERROR = "TIMEOUT_ERROR";
const PROB_CONNECTION_ERROR = "CONNECTION_ERROR";
const PROB_NETWORK_ERROR = "NETWORK_ERROR";
const PROB_CANCEL_ERROR = "CANCEL_ERROR";

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
  STT_CONFLICT,
  STT_GONE,
  STT_NOT_ACCEPTABLE,
  
  // API
  API_TEST,
  API_TESTAUTH,
  
  API_LOGIN,
  API_REGISTER,
  
  API_INITKEY,
  API_GETKEY,
  API_CHECKKEYSTATUS,
  API_UPDATEONETIME,

  API_SENDMESSAGES,
  API_FETCHMESSAGES,
  API_CLEARMESSAGES,

  API_FETCHUSERS,

  // Problems
  PROB_NONE,
  PROB_CLIENT_ERROR,
  PROB_SERVER_ERROR,
  PROB_TIMEOUT_ERROR,
  PROB_CONNECTION_ERROR,
  PROB_NETWORK_ERROR,
  PROB_CANCEL_ERROR,
};