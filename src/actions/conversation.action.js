import { object, string, boolean, array, number } from "yup";
import StringFormat from "string-format";
import { ConversationApi } from "api";
import { bufferToHex, hexToBuffer } from "utils/buffer.util";
import { SystemConstant, StorageConstant, TxtConstant, NativeConstant, ApiConstant } from "const";
import { DeviceModel, MessageModel, SessionModel } from "models";
import { CryptoInteractor } from "interactor";
import { getLocalStorage } from "utils/storage.util";
import { parseResponse } from "utils/api.util";

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

function encryptMessageInStoredSessions(userID, message, messageID)
{
  var messageObjs = [];
  var deviceRecords = DeviceModel.findAll({
    userID: userID
  });

  for (var deviceRecord of deviceRecords) {
    if (deviceRecord.state === SystemConstant.DEVICE_STATE.active) {
      var { _id:sessionID, _data:sessionRecord } = SessionModel.findOneWithId({
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

        // Write new rachet state to database.
        hexifyRachetStateObj(nxtRachetState);
        SessionModel.findOneByIdAndUpdate(sessionID, { rachetState: nxtRachetState });

        // Push successful ciphertext into array.
        messageObjs.push({
          type: SystemConstant.MESSAGE_TYPE.normal,
          header: bufferToHex(CryptoInteractor.serializeRachetHeader(rachetHeader)),
          message: bufferToHex(ciphertext),
          messageID: messageID,
          receipientDeviceID: deviceRecord.deviceID,
        });
      }
    }
  }

  return messageObjs;
}

function markDevicesAsStale(userID, deviceIDs)
{
  var error = "";

  try {
    for (var deviceID of deviceIDs) {
      DeviceModel.findOneAndUpdate({
        userID: userID,
        deviceID: deviceID
      }, { state: SystemConstant.DEVICE_STATE.stale });
    }
  } catch (err) {
    error = StringFormat(TxtConstant.FM_DATABASE_ERROR, error);
  }

  return {
    error: error
  }
}

function sendMessageForNewDevices(userID, deviceIDs, message, messageID)
{
  console.log(deviceIDs)
  return {
    error: ""
  }
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
      header: string().required(),
      message: string().required(),
      messageID: string().required(),
      timestamp: number().default(Date.now()),
      receipientDeviceID: string().required(),
    })
  );

  const responseSchema = object({
    oldDeviceIDs: array().of(string()).default([]),
    newDeviceIDs: array().of(string()).default([]),
    error: string().default(""),
  });
  
  // --------------------- Push message to the database ---------------------.
  var { _id:messageID, _data:newMessageRecord } = MessageModel.create({
                                                    userID: data.receipientUserID,
                                                    message: data.message,
                                                    side: SystemConstant.CHAT_SIDE_TYPE.our,
                                                    timestamp: Date.now()
                                                  });
  

  // --------------------- Request send to the UserID's mailbox ---------------------.
  var requestOther = requestSchema.cast(
    encryptMessageInStoredSessions(
      data.receipientUserID,
      data.message,
      messageID,
    )
  );

  var responseOther = await ConversationApi.sendMessage(data.receipientUserID, requestOther);
  var {
    error,
    responseData,
  } = parseResponse(responseSchema, responseOther);

  // Add/remove new/old devices added to the server.
  if (error) {
    if (responseOther.status && responseData && responseOther.status === ApiConstant.STT_CONFLICT) {
      var {error} = markDevicesAsStale(data.receipientUserID, responseData.oldDeviceIDs);
      if (error)
        return {
          error: error
        }

      var {error} = sendMessageForNewDevices(data.receipientUserID, responseData.newDeviceIDs, data.message, messageID);
      if (error) 
        return {
          error: error
        }
    } 
    else 
      return {
        error: error
      }
  }

  // --------------------- Request send to the our other devices' mailbox ---------------------.
  // var requestMe = requestSchema.cast(
  //   encryptMessageInStoredSessions(
  //     getLocalStorage(StorageConstant.USER_ID),
  //     data.message,
  //     messageID,
  //   )
  // );

  // var responseMe = await ConversationApi.sendMessage(getLocalStorage(StorageConstant.USER_ID), requestMe);
  // var {
  //   error,
  //   responseData,
  // } = parseResponse(responseSchema, responseMe);

  // // Add/remove new/old devices added to the server.
  // if (error) {
  //   if (responseOther.status && responseOther.status === ApiConstant.STT_CONFLICT) {
  //     markDevicesAsStale(responseData.oldDeviceIDs);
  //     encryptMessageForNewDevices(responseData.newDeviceIDs);
  //   } else {
  //     return {
  //       error: error
  //     }
  //   }
  // }

}