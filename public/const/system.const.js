const CHAT_SIDE_TYPE = {
  our: 0,
  their: 1
};

const KEY_TYPE = {
  identity: 0,
  signedPrekey: 1,
  onetimePrekey: 2,
}

const NO_ONETIME_PREKEYS = 100;

module.exports = {
  CHAT_SIDE_TYPE,
  NO_ONETIME_PREKEYS,
  KEY_TYPE,
}