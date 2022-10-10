import { object, string, boolean, array, number } from "yup";
import { ConversationApi } from "api";
import { bufferToHex, hexToBuffer } from "utils/buffer.util";
import { TxtConstant, SystemConstant, StorageConstant } from "const";
import { DeviceModel, SessionModel } from "models";
import { CryptoInteractor } from "interactor";
import { getLocalStorage } from "utils/storage.util";

function unHexifyRachetStateObj(obj)
{

}

function hexifyRachetStateObj(obj)
{

}

function encryptMessageInStoredSessions(userID, message)
{
  var ciphertextObjs = [];
  var deviceRecords = DeviceModel.findAll({
    userID: userID
  });

  for (var deviceRecord of deviceRecords) {
    if (deviceRecord.state === SystemConstant.DEVICE_STATE.active) {
      var sessionRecord = SessionModel.findOne({
        userID: userID,
        deviceID: deviceRecord.deviceID,
        state: SystemConstant.SESSION_STATE.active
      });

      if (sessionRecord !== null) {
        // Pull encrypt materials
        var rachetState = unHexifyRachetStateObj(sessionRecord.rachetState);
        var associatedData = hexToBuffer(sessionRecord.associatedData);
        var plaintext = new TextEncoder().encode(message);
  
        // Encrypt!
        var {
          nxtRachetState,
          rachetHeader,
          ciphertext
        } = CryptoInteractor.signalEncrypt(rachetState, plaintext, associatedData);
  
        // Check if encrypt successful, then write new rachet state to database.
        if (ciphertext.length === 0)
          continue;
  
        SessionModel.findOneAndUpdate({
          userID: userID,
          deviceID: deviceRecord.deviceID,
          state: SystemConstant.SESSION_STATE.active,
        }, 
        {
          rachetState: hexifyRachetStateObj(nxtRachetState)
        });

        // Push successful ciphertext into array.
        ciphertextObjs.push({
          userID: userID,
          deviceID: deviceRecord.deviceID,
          ciphertext: bufferToHex(ciphertext),
          rachetHeader: bufferToHex(CryptoInteractor.serializeRachetHeader(rachetHeader))
        });
      }
    }
  }

  return ciphertextObjs;
}

export async function sendMessage(data) 
{
  // Sanitize input
  const dataSchema = object({
    receipientUserID: string().required(),
    message: string().required(),
  })
  data = dataSchema.validateSync(data);

  // Schema for publishing message to server.
  const requestSchema = array().of(
    object({
      type: number().required(),    // Type of message: initiate / normal
      receipientDeviceID: string().required(),
      message: string().required(),
      timestamp: number().default(Date.now())
    })
  );

  // Get all devices with userID
  var ciphertextObjs = encryptMessageInStoredSessions(
    data.receipientUserID,
    data.message
  ).concat(encryptMessageInStoredSessions(
    "", // TODO: return here.
    data.message
  ));


}