import { object, string, boolean, array, number } from "yup";
import { ConversationApi } from "api";
import { bufferToHex, hexToBuffer } from "utils/buffer.util";
import { TxtConstant, SystemConstant, StorageConstant, NativeConstant } from "const";
import { DeviceModel, SessionModel } from "models";
import { CryptoInteractor } from "interactor";
import { getLocalStorage } from "utils/storage.util";

function unHexifyRachetStateObj(obj)
{
  obj[NativeConstant.DHSEND][NativeConstant.PUBLIC_KEY]  = hexToBuffer(obj[NativeConstant.DHSEND][NativeConstant.PUBLIC_KEY]);
  obj[NativeConstant.DHSEND][NativeConstant.PRIVATE_KEY] = hexToBuffer(obj[NativeConstant.DHSEND][NativeConstant.PRIVATE_KEY]);
  obj[NativeConstant.ROOTKEY] = hexToBuffer(obj[NativeConstant.ROOTKEY]);
  obj[NativeConstant.CHAINKEYSEND] = hexToBuffer(obj[NativeConstant.CHAINKEYSEND]);
  obj[NativeConstant.CHAINKEYRECV] = hexToBuffer(obj[NativeConstant.CHAINKEYRECV]);
  for (var i in obj[NativeConstant.SKIPPEDKEYS]) {
    obj[NativeConstant.SKIPPEDKEYS][i][NativeConstant.DHPUBLIC] = hexToBuffer(obj[NativeConstant.SKIPPEDKEYS][i][NativeConstant.DHPUBLIC]);
    obj[NativeConstant.SKIPPEDKEYS][i][NativeConstant.MESSAGEKEY] = hexToBuffer(obj[NativeConstant.SKIPPEDKEYS][i][NativeConstant.MESSAGEKEY]);
  }
}

function hexifyRachetStateObj(obj)
{
  obj[NativeConstant.DHSEND][NativeConstant.PUBLIC_KEY]  = hexToBuffer(obj[NativeConstant.DHSEND][NativeConstant.PUBLIC_KEY]);
  obj[NativeConstant.DHSEND][NativeConstant.PRIVATE_KEY] = hexToBuffer(obj[NativeConstant.DHSEND][NativeConstant.PRIVATE_KEY]);
  obj[NativeConstant.ROOTKEY] = hexToBuffer(obj[NativeConstant.ROOTKEY]);
  obj[NativeConstant.CHAINKEYSEND] = hexToBuffer(obj[NativeConstant.CHAINKEYSEND]);
  obj[NativeConstant.CHAINKEYRECV] = hexToBuffer(obj[NativeConstant.CHAINKEYRECV]);
  for (var i in obj[NativeConstant.SKIPPEDKEYS]) {
    obj[NativeConstant.SKIPPEDKEYS][i][NativeConstant.DHPUBLIC] = hexToBuffer(obj[NativeConstant.SKIPPEDKEYS][i][NativeConstant.DHPUBLIC]);
    obj[NativeConstant.SKIPPEDKEYS][i][NativeConstant.MESSAGEKEY] = hexToBuffer(obj[NativeConstant.SKIPPEDKEYS][i][NativeConstant.MESSAGEKEY]);
  }
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
        unHexifyRachetStateObj(sessionRecord.rachetState);
        var rachetState = sessionRecord.rachetState;
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
        hexifyRachetStateObj(nxtRachetState);
  
        SessionModel.findOneAndUpdate({
          userID: userID,
          deviceID: deviceRecord.deviceID,
          sessionID: deviceRecord.sessionID,
        }, 
        {
          rachetState: nxtRachetState
        });

        // Push successful ciphertext into array.
        ciphertextObjs.push({
          type: SystemConstant.MESSAGE_TYPE.normal,
          receipientDeviceID: deviceRecord.deviceID,
          ciphertext: bufferToHex(ciphertext),
          header: bufferToHex(CryptoInteractor.serializeRachetHeader(rachetHeader))
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
      type: number().required().oneOf(Object.values(SystemConstant.MESSAGE_TYPE)),    // Type of message: initiate / normal
      receipientDeviceID: string().required(),
      message: string().required(),
      header: string().required(),
      timestamp: number().default(Date.now())
    })
  );

  const responseSchema = object({
    success: boolean().required(),
    oldDeviceIDs: array().of(string()).default([]),
    newDeviceIDs: array().of(string()).default([]),
    error: string().default(""),
  });

  const returnSchema = object({
    success: boolean().required(),
    error: string().default(""),
  })

  // --------------------- Request send to the UserID's mailbox ---------------------.
  var requestOther = requestSchema.cast(
    encryptMessageInStoredSessions(
      data.receipientUserID,
      data.message
    )
  );

  var responseOther = await ConversationApi.sendMessage(data.receipientUserID, requestOther);
  if (responseOther.problem) {
    return returnSchema.cast({
      success: false,
      error: responseOther.problem
    })
  }

  // --------------------- Request send to the our other devices' mailbox ---------------------.
  var requestMe = requestSchema.cast(
    encryptMessageInStoredSessions(
      getLocalStorage(StorageConstant.USER_ID),
      data.message
    )
  );

  var responseMe = await ConversationApi.sendMessage(getLocalStorage(StorageConstant.USER_ID), requestMe);
}