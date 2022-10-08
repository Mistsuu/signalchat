import { KeyApi } from "api";
import { object, string, boolean, array } from "yup";
import StringFormat from "string-format";
import { CryptoInteractor } from "interactor";
import { TxtConstant, SystemConstant } from "const";
import { bufferToHex } from "utils/buffer.util";
import { PrekeyModel } from "models";

async function writePreKeyBundleToDB(prekeyBundle) {
  // Clear database file
  PrekeyModel.dropAll();

  // Write identity key
  await PrekeyModel.create({
    keyType: SystemConstant.KEY_TYPE.identity,
    publicKey: bufferToHex(prekeyBundle.identityKey.publicKey),
    privateKey: bufferToHex(prekeyBundle.identityKey.privateKey)
  })

  // Write signed prekey
  await PrekeyModel.create({
    keyType: SystemConstant.KEY_TYPE.signedPrekey,
    publicKey: bufferToHex(prekeyBundle.signedPreKey.publicKey),
    privateKey: bufferToHex(prekeyBundle.signedPreKey.privateKey),
    signature: bufferToHex(prekeyBundle.signature),
  })
  
  // Write one time prekeys
  for (var onetimePrekey of prekeyBundle.oneTimePreKeys)
    await PrekeyModel.create({
      keyType: SystemConstant.KEY_TYPE.onetimePrekey,
      publicKey: bufferToHex(onetimePrekey.publicKey),
      privateKey: bufferToHex(onetimePrekey.privateKey),
    });
}

export async function initKeys() {
  // TODO: Fetch keys from database, or generate if it doesn't exist.
  var prekeyBundle = CryptoInteractor.generateBobPrekeyBundle();

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

  // Send data
  var request = await requestSchema.validate({
    identityKey: bufferToHex(prekeyBundle.identityKey.publicKey),
    signedPrekey: bufferToHex(prekeyBundle.signedPreKey.publicKey),
    signature: bufferToHex(prekeyBundle.signature),
    onetimePrekeys: prekeyBundle.oneTimePreKeys.map(onetimePrekey => bufferToHex(onetimePrekey.publicKey)),
  });
  var response = await KeyApi.initKeys(request);

  // Check output
  var success = false;
  var error = "";
  var data = responseSchema.cast({
    success: success,
    error: error,
  });

  if (response.ok) {
    // Validate input!
    try {
      data = await responseSchema.validate(response.data);
    } catch (err) {
      error = StringFormat(TxtConstant.FM_REQUEST_ERROR, TxtConstant.ERR_INVALID_RESPONSE_FROM_SERVER);
    }

    // Write keys to database if upload is successful!
    try {
      if (data.success)
        await writePreKeyBundleToDB(prekeyBundle);
      return data;
    } catch (err) {
      error = StringFormat(TxtConstant.FM_DATABASE_ERROR, err);
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