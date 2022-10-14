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
  ONETIME_PREKEY,
} = require("../const/native.const");

const PrekeyModel = require("../models/prekey.model");

const getIdentityKey = () => {
  var identityKeyRecord = PrekeyModel.findOne({ keyType: SystemConstant.KEY_TYPE.identity });
  if (identityKeyRecord !== null) {
    return {
      [PUBLIC_KEY]: hex2Buffer(identityKeyRecord.publicKey),
      [PRIVATE_KEY]: hex2Buffer(identityKeyRecord.privateKey)
    }
  } 
  
  let keyPair = generateKeyPair();
  PrekeyModel.create({ 
    keyType: SystemConstant.KEY_TYPE.identity,
    publicKey: buffer2Hex(keyPair[PUBLIC_KEY]),
    privateKey: buffer2Hex(keyPair[PRIVATE_KEY]),
  });
  return keyPair;
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

const generateBobOneTimePrekeys = () => {
  var oneTimePrekeys = [];
  for (let i = 0; i < SystemConstant.NO_ONETIME_PREKEYS; ++i) 
    oneTimePrekeys.push(generateKeyPair());
  return oneTimePrekeys;
}

const verifyBobPrekeyBundle = (bobPrekeyBundle) => {
  return verifySignature(
          bobPrekeyBundle[IDENTITY_KEY][PUBLIC_KEY],
          bobPrekeyBundle[SIGNED_PREKEY][PUBLIC_KEY],
          bobPrekeyBundle[SIGNATURE]
         );
}

const getNativeAlicePrekeyBundle = (
  identityKeyPublic, 
  ephemeralKeyPublic
) => {
  return {
    [IDENTITY_KEY]: {
      [PUBLIC_KEY]: hex2Buffer(identityKeyPublic),
      [PRIVATE_KEY]: new Uint8Array(),
    },
    [EPHEMERAL_KEY]: {
      [PUBLIC_KEY]: hex2Buffer(ephemeralKeyPublic),
      [PRIVATE_KEY]: new Uint8Array(),
    },
  };
}

const getNativeBobPrekeyBundle = (
  identityKeyPublic, 
  signedPrekeyPublic, 
  signature, 
  onetimePrekeyPublic
) => {
  return {
    [IDENTITY_KEY]: {
      [PUBLIC_KEY]: hex2Buffer(identityKeyPublic),
      [PRIVATE_KEY]: new Uint8Array(),
    },
    [SIGNED_PREKEY]: {
      [PUBLIC_KEY]: hex2Buffer(signedPrekeyPublic),
      [PRIVATE_KEY]: new Uint8Array(),
    },
    [SIGNATURE]: hex2Buffer(signature),
    [ONETIME_PREKEY]: onetimePrekeyPublic.length 
                        ? {
                            [PUBLIC_KEY]: hex2Buffer(onetimePrekeyPublic),
                            [PRIVATE_KEY]: new Uint8Array(),
                          } 
                        : {
                            [PUBLIC_KEY]: null,
                            [PRIVATE_KEY]: null,
                          }
  };
}

const getFullNativeBobPrekeyBundle = (
  identityKeyPublic, 
  identityKeyPrivate, 

  signedPrekeyPublic, 
  signedPrekeyPrivate, 
  signature, 

  onetimePrekeyPublic,
  onetimePrekeyPrivate,
) => {
  return {
    [IDENTITY_KEY]: {
      [PUBLIC_KEY]: hex2Buffer(identityKeyPublic),
      [PRIVATE_KEY]: hex2Buffer(identityKeyPrivate),
    },
    [SIGNED_PREKEY]: {
      [PUBLIC_KEY]: hex2Buffer(signedPrekeyPublic),
      [PRIVATE_KEY]: hex2Buffer(signedPrekeyPrivate),
    },
    [SIGNATURE]: hex2Buffer(signature),
    [ONETIME_PREKEY]: onetimePrekeyPublic 
                        ? {
                            [PUBLIC_KEY]: hex2Buffer(onetimePrekeyPublic),
                            [PRIVATE_KEY]: hex2Buffer(onetimePrekeyPrivate),
                          } 
                        : {
                            [PUBLIC_KEY]: new Uint8Array()
                          }
  };
}

module.exports = {
  getIdentityKey,
  generateAlicePrekeyBundle,
  generateBobPrekeyBundle,
  generateBobOneTimePrekeys,
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
  getNativeAlicePrekeyBundle,
  getNativeBobPrekeyBundle,
  getFullNativeBobPrekeyBundle,
}