import { KeyApi } from "api";
import { object, string, boolean, array } from "yup";
import StringFormat from "string-format";
import { CryptoInteractor } from "interactor";
import { TxtConstant, SystemConstant } from "const";
import { bufferToHex } from "utils/buffer.util";
import { PrekeyModel } from "models";

function writePreKeyBundleToDB(prekeyBundle) {
  // Clear database file
  PrekeyModel.dropAll();

  // Write identity key
  PrekeyModel.create({
    keyType: SystemConstant.KEY_TYPE.identity,
    publicKey: bufferToHex(prekeyBundle.identityKey.publicKey),
    privateKey: bufferToHex(prekeyBundle.identityKey.privateKey)
  })

  // Write signed prekey
  PrekeyModel.create({
    keyType: SystemConstant.KEY_TYPE.signedPrekey,
    publicKey: bufferToHex(prekeyBundle.signedPreKey.publicKey),
    privateKey: bufferToHex(prekeyBundle.signedPreKey.privateKey),
    signature: bufferToHex(prekeyBundle.signature),
  })
  
  // Write one time prekeys
  for (var onetimePrekey of prekeyBundle.oneTimePreKeys)
    PrekeyModel.create({
      keyType: SystemConstant.KEY_TYPE.onetimePrekey,
      publicKey: bufferToHex(onetimePrekey.publicKey),
      privateKey: bufferToHex(onetimePrekey.privateKey),
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
    success: boolean().required(),
    error: string().default(""),
  })

  // Fetch keys from database, or generate if it doesn't exist.
  var prekeyBundle = fetchKeysFromDB();
  var isGenerateNewKeys = (prekeyBundle === null);
  var request = null;
  if (isGenerateNewKeys) {
    prekeyBundle = CryptoInteractor.generateBobPrekeyBundle();
    request = requestSchema.cast({
      identityKey: bufferToHex(prekeyBundle.identityKey.publicKey),
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

  // Check output
  var success = false;
  var error = "";
  var data = responseSchema.cast({
    success: success,
    error: error,
  });

  if (response.ok) {
    try {
      // Validate input
      data = responseSchema.validateSync(response.data);
      
      // Write keys to database if upload is successful!
      try {
        if (data.success && isGenerateNewKeys)
          writePreKeyBundleToDB(prekeyBundle);
        return data;
      } catch (err) {
        error = StringFormat(TxtConstant.FM_DATABASE_ERROR, err);
      }
    } catch (err) {
      error = StringFormat(TxtConstant.FM_REQUEST_ERROR, TxtConstant.ERR_INVALID_RESPONSE_FROM_SERVER);
    }
  } else {
    error = StringFormat(TxtConstant.FM_REQUEST_ERROR, response.problem);
  }

  // Return data to view.
  return responseSchema.cast({
    success: success,
    error: error,
  });
}

export async function checkAndUploadKey() {
  // Create schemas
  let responseSchema = object({
    success: boolean().required(),
    error: string().default(""),
  })

  // Get API call
  var response = await KeyApi.checkKeyStatus();
  var success = false;
  var error = "";

  if (response.ok) {
    try {
      // Validate input
      var data = responseSchema.validateSync(response.data);

      // Check if key exists, if not upload now!
      if (!data.success)
        return responseSchema.cast(await initKeys());
      else 
        return data;

    } catch (err) {
      error = StringFormat(TxtConstant.FM_REQUEST_ERROR, TxtConstant.ERR_INVALID_RESPONSE_FROM_SERVER);
    }
  } else {
    error = StringFormat(TxtConstant.FM_REQUEST_ERROR, response.problem);
  }

  // Return data to view.
  return responseSchema.cast({
    success: success,
    error: error,
  });
}