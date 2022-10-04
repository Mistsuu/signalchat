const {
  generateKeyPair,
  calculateSignature,
  verifySignature,
  calculateSharedSecretA,
  calculateSharedSecretB,
  rachetInitAlice,
  rachetInitBob,
  calculateAssociatedData,
  signalEncrypt,
  signalDecrypt,
} = require("../utils/crypto.util");

const {
  buffer2Hex,
  hex2Buffer,
} = require("../utils/buffer.util");

const {
  StorageConstant,
  SystemConstant,
} = require("../const");

const {
  PUBLIC_KEY,
  PRIVATE_KEY,
  IDENTITY_KEY,
  EPHEMERAL_KEY,
  SIGNED_PREKEY,
  ONETIME_PREKEYS,
  SIGNATURE,
} = require("../const/native.const");

const getIdentityKey = () => {
  if (!localStorage.getItem(StorageConstant.IDENTITY_KEY_PUBLIC)
   || !localStorage.getItem(StorageConstant.IDENTITY_KEY_PRIVATE)) {
    let keyPair = generateKeyPair();
    localStorage.setItem(StorageConstant.IDENTITY_KEY_PUBLIC, buffer2Hex(keyPair[PUBLIC_KEY]));
    localStorage.setItem(StorageConstant.IDENTITY_KEY_PRIVATE, buffer2Hex(keyPair[PRIVATE_KEY]));
  }

  return {
    [PUBLIC_KEY]: hex2Buffer(localStorage.getItem(StorageConstant.IDENTITY_KEY_PUBLIC)),
    [PRIVATE_KEY]: hex2Buffer(localStorage.getItem(StorageConstant.IDENTITY_KEY_PRIVATE))
  }
}

const generateAlicePrekeyBundle = () => {
  let alicePrekeyBundle = {};
  alicePrekeyBundle[IDENTITY_KEY] = getIdentityKey();
  alicePrekeyBundle[EPHEMERAL_KEY] = generateKeyPair();
  return alicePrekeyBundle;
}

const generateBobPrekeysBundle = () => {
  let bobPrekeysBundle = {};
  bobPrekeysBundle[IDENTITY_KEY] = getIdentityKey();
  bobPrekeysBundle[SIGNED_PREKEY] = generateKeyPair();
  bobPrekeysBundle[SIGNATURE] = calculateSignature(
                                  bobPrekeysBundle[IDENTITY_KEY][PRIVATE_KEY],
                                  bobPrekeysBundle[SIGNED_PREKEY][PUBLIC_KEY]
                                );
  bobPrekeysBundle[ONETIME_PREKEYS] = [];
  for (let i = 0; i < SystemConstant.NO_ONETIME_PREKEYS; ++i) 
    bobPrekeysBundle[ONETIME_PREKEYS].push(generateKeyPair());
  return bobPrekeysBundle;
}

const verifyBobPrekeyBundle = (bobPrekeyBundle) => {
  return verifySignature(
          bobPrekeyBundle[IDENTITY_KEY][PUBLIC_KEY],
          bobPrekeyBundle[SIGNED_PREKEY][PUBLIC_KEY],
          bobPrekeyBundle[SIGNATURE]
         );
}

module.exports = {
  getIdentityKey,
  generateAlicePrekeyBundle,
  generateBobPrekeysBundle,
  generateKeyPair,
  verifyBobPrekeyBundle,
  rachetInitAlice,
  rachetInitBob,
  calculateSharedSecretA,
  calculateSharedSecretB,
  signalEncrypt,
  signalDecrypt,
  calculateAssociatedData,
}