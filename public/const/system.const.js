const CHAT_SIDE_TYPE = {
  our: 0,
  their: 1
};

const KEY_TYPE = {
  identity: 0,
  signedPrekey: 1,
  onetimePrekey: 2,
}

const DEVICE_STATE = {
  stale: 0,
  active: 1,
};

const SESSION_STATE = {
  inactive: 0,
  active: 1,
};

const MESSAGE_TYPE = {
  initial: 0,
  normal: 1,
};

const KEY_STATE = {
  ok: 0,
  notUploaded: 1,
  lowOneTime: 2, 
}

const NO_ONETIME_PREKEYS = 100;
const MAX_INTERVAL = 3600;

module.exports = {
  CHAT_SIDE_TYPE,
  NO_ONETIME_PREKEYS,
  KEY_TYPE,
  DEVICE_STATE,
  SESSION_STATE,
  KEY_STATE,
  MESSAGE_TYPE,
  MAX_INTERVAL,
}