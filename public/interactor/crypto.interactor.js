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
  innerEncrypt,
  innerDecrypt,
  serializeRachetHeader,
  deserializeRachetHeader,
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

const generateBobPrekeyBundle = () => {
  let bobPrekeyBundle = {};
  bobPrekeyBundle[IDENTITY_KEY] = getIdentityKey();
  bobPrekeyBundle[SIGNED_PREKEY] = generateKeyPair();
  bobPrekeyBundle[SIGNATURE] = calculateSignature(
                                  bobPrekeyBundle[IDENTITY_KEY][PRIVATE_KEY],
                                  bobPrekeyBundle[SIGNED_PREKEY][PUBLIC_KEY]
                                );
  bobPrekeyBundle[ONETIME_PREKEYS] = [];
  for (let i = 0; i < SystemConstant.NO_ONETIME_PREKEYS; ++i) 
    bobPrekeyBundle[ONETIME_PREKEYS].push(generateKeyPair());
  return bobPrekeyBundle;
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
  generateBobPrekeyBundle,
  generateKeyPair,
  verifyBobPrekeyBundle,
  rachetInitAlice,
  rachetInitBob,
  calculateSharedSecretA,
  calculateSharedSecretB,
  innerEncrypt,
  innerDecrypt,
  signalEncrypt,
  signalDecrypt,
  serializeRachetHeader,
  deserializeRachetHeader,
  calculateAssociatedData,
}