import StringFormat from "string-format";
import { KeyApi } from "api";
import { object, string, boolean, array } from "yup";
import { CryptoInteractor } from "interactor";
import { TxtConstant, SystemConstant, NativeConstant } from "const";
import { bufferToHex, hexToBuffer } from "utils/buffer.util";
import { parseResponse } from "utils/api.util";
import { DeviceModel, PrekeyModel } from "models";

function writePreKeyBundleToDB(prekeyBundle) {
  // Clear database file
  PrekeyModel.dropAll();

  // Write identity key
  PrekeyModel.create({
    keyType: SystemConstant.KEY_TYPE.identity,
    publicKey: bufferToHex(prekeyBundle[NativeConstant.IDENTITY_KEY][NativeConstant.PUBLIC_KEY]),
    privateKey: bufferToHex(prekeyBundle[NativeConstant.IDENTITY_KEY][NativeConstant.PRIVATE_KEY])
  })

  // Write signed prekey
  PrekeyModel.create({
    keyType: SystemConstant.KEY_TYPE.signedPrekey,
    publicKey: bufferToHex(prekeyBundle[NativeConstant.SIGNED_PREKEY][NativeConstant.PUBLIC_KEY]),
    privateKey: bufferToHex(prekeyBundle[NativeConstant.SIGNED_PREKEY][NativeConstant.PRIVATE_KEY]),
    signature: bufferToHex(prekeyBundle[NativeConstant.SIGNATURE]),
  })
  
  // Write one time prekeys
  for (var onetimePrekey of prekeyBundle[NativeConstant.ONETIME_PREKEYS])
    PrekeyModel.create({
      keyType: SystemConstant.KEY_TYPE.onetimePrekey,
      publicKey: bufferToHex(onetimePrekey[NativeConstant.PUBLIC_KEY]),
      privateKey: bufferToHex(onetimePrekey[NativeConstant.PRIVATE_KEY]),
    });
}

function fetchKeysFromDB() {
  var prekeyBundle = {};
  
  // Set identity key.
  const identityKeyRecord = PrekeyModel.findOne({keyType: SystemConstant.KEY_TYPE.identity});
  if (identityKeyRecord === null) 
    return null;
  prekeyBundle.identityKey = identityKeyRecord.publicKey;

  // Set signed prekey.
  const signedPrekeyRecord = PrekeyModel.findOne({keyType: SystemConstant.KEY_TYPE.signedPrekey});
  if (signedPrekeyRecord === null)
    return null;
  prekeyBundle.signedPrekey = signedPrekeyRecord.publicKey;
  prekeyBundle.signature = signedPrekeyRecord.signature;

  // Set onetime prekeys.
  const onetimePrekeyRecords = PrekeyModel.findAll({keyType: SystemConstant.KEY_TYPE.onetimePrekey});
  if (onetimePrekeyRecords === [])
    return null;
  prekeyBundle.onetimePrekeys = onetimePrekeyRecords.map(record => record.publicKey);

  return prekeyBundle;
}

export async function initKeys() {
  // Create schema
  let requestSchema = object({
    identityKey: string().required(),
    signedPrekey: string().required(),
    signature: string().required(),
    onetimePrekeys: array().of(string()).required(),
  });

  let responseSchema = object({
    error: string().default(""),
  })

  // Fetch keys from database, or generate if it doesn't exist.
  var prekeyBundle = fetchKeysFromDB();
  var isGenerateNewKeys = (prekeyBundle === null);
  var request = null;
  if (isGenerateNewKeys) {
    prekeyBundle = CryptoInteractor.generateBobPrekeyBundle();
    request = requestSchema.cast({
      identityKey: bufferToHex(prekeyBundle[NativeConstant.IDENTITY_KEY][NativeConstant.PUBLIC_KEY]),
      signedPrekey: bufferToHex(prekeyBundle.signedPreKey.publicKey),
      signature: bufferToHex(prekeyBundle.signature),
      onetimePrekeys: prekeyBundle.oneTimePreKeys.map(onetimePrekey => bufferToHex(onetimePrekey.publicKey)),
    });
  } else {
    request = requestSchema.cast({
      identityKey: prekeyBundle.identityKey,
      signedPrekey: prekeyBundle.signedPrekey,
      signature: prekeyBundle.signature,
      onetimePrekeys: prekeyBundle.onetimePrekeys,
    });
  }

  // Send data
  var response = await KeyApi.initKeys(request);
  var {
    error, 
    responseData,
  } = parseResponse(responseSchema, response);

  // Write keys to database if upload is successful!
  if (!error && isGenerateNewKeys)
    try {
      writePreKeyBundleToDB(prekeyBundle);
    } catch (err) {
      return {
        error: StringFormat(TxtConstant.FM_DATABASE_ERROR, err)
      }
    }

  return {
    error: error
  }
}

export async function checkAndUploadKey() {
  // Create schemas
  let responseSchema = object({
    isKeyExists: boolean().required(),
  })

  // Get API call
  var response = await KeyApi.checkKeyStatus();
  var {
    error, 
    responseData,
  } = parseResponse(responseSchema, response);

  if (!error && !responseData.isKeyExists)
    return await initKeys();

  return {
    error: error,
  }
}

function verifyPrekeyBundle(userID, deviceID, prekeyBundle) {
  const record = DeviceModel.findOne({
    userID: userID,
    deviceID: deviceID,
  });

  // Verify the signed pre-key if it's came from
  // our identity key.
  var NativeBobPrekeyBundle = CryptoInteractor.getNativeBobPrekeyBundle(
    hexToBuffer(prekeyBundle.identityKey),
    hexToBuffer(prekeyBundle.signedPrekey),
    hexToBuffer(prekeyBundle.signature),
    hexToBuffer(prekeyBundle.oneTimePrekey)
  );
  if (!CryptoInteractor.verifyBobPrekeyBundle(NativeBobPrekeyBundle)) {
    return {
      error: TxtConstant.ERR_VERIFY_PREKEY_BUNDLE_FAILED
    }
  }

  // If record does not exists, create one
  // else check it with the current identity key.
  if (record === null) {
    DeviceModel.create({
      userID: userID,
      deviceID: deviceID,
      identityKey: prekeyBundle.identityKey,
      state: SystemConstant.DEVICE_STATE.active
    })
  }
  else if (record.identityKey !== prekeyBundle.identityKey) {
    return {
      error: TxtConstant.ERR_VERIFY_PREKEY_BUNDLE_FAILED
    }
  }
   
  return {
    ...NativeBobPrekeyBundle,
    error: "",
  };
}

export async function fetchPrekeyBundle(userID, deviceID) {
  // Create schemas
  var responseSchema = object({
    identityKey: string().default(""), 
    signedPrekey: string().default(""),
    signature: string().default(""),
    oneTimePrekey: string().default(""),
    error: string().default(""),
  });

  var response = await KeyApi.getKey(userID, deviceID);
  var {
    error,
    responseData,
  } = parseResponse(responseSchema, response);

  // Handle key change.
  if (!error) {
    return verifyPrekeyBundle(userID, deviceID, responseData)
  }

  return {
    error: error
  }
}