import { object, string, boolean, array, number } from "yup";
import StringFormat from "string-format";
import { ConversationApi } from "api";
import { bufferToHex, hexToBuffer } from "utils/buffer.util";
import { SystemConstant, StorageConstant, TxtConstant, NativeConstant, ApiConstant } from "const";
import { DeviceModel, MessageModel, SessionModel, CipherModel, PrekeyModel } from "models";
import { CryptoInteractor } from "interactor";
import { getLocalStorage } from "utils/storage.util";
import { parseResponse } from "utils/api.util";
import { KeyAction } from "actions";

function unHexifyRachetStateObj(obj)
{
  obj[NativeConstant.DHRECV]                             = hexToBuffer(obj[NativeConstant.DHRECV]);
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
  obj[NativeConstant.DHRECV]                             = bufferToHex(obj[NativeConstant.DHRECV]);
  obj[NativeConstant.DHSEND][NativeConstant.PUBLIC_KEY]  = bufferToHex(obj[NativeConstant.DHSEND][NativeConstant.PUBLIC_KEY]);
  obj[NativeConstant.DHSEND][NativeConstant.PRIVATE_KEY] = bufferToHex(obj[NativeConstant.DHSEND][NativeConstant.PRIVATE_KEY]);
  obj[NativeConstant.ROOTKEY] = bufferToHex(obj[NativeConstant.ROOTKEY]);
  obj[NativeConstant.CHAINKEYSEND] = bufferToHex(obj[NativeConstant.CHAINKEYSEND]);
  obj[NativeConstant.CHAINKEYRECV] = bufferToHex(obj[NativeConstant.CHAINKEYRECV]);
  for (var i in obj[NativeConstant.SKIPPEDKEYS]) {
    obj[NativeConstant.SKIPPEDKEYS][i][NativeConstant.DHPUBLIC] = bufferToHex(obj[NativeConstant.SKIPPEDKEYS][i][NativeConstant.DHPUBLIC]);
    obj[NativeConstant.SKIPPEDKEYS][i][NativeConstant.MESSAGEKEY] = bufferToHex(obj[NativeConstant.SKIPPEDKEYS][i][NativeConstant.MESSAGEKEY]);
  }
}

// ==============================================================================================================
//                                             ENCRYPTION 
// ==============================================================================================================

function encryptIntialMessageNewSession(userID, deviceID, NativeBobPrekeyBundle)
{
  var headerSchema = object({
    aliceIdentityKey: string().required(),
    aliceEphemeralKey: string().required(),
    bobOneTimePrekey: string().default(""),
  })

  try {
    // Generate new prekey bundle for Alice (the sender)
    var NativeAlicePrekeyBundle = CryptoInteractor.generateAlicePrekeyBundle();

    // Derive shared secret, associated data & rachet state
    var sharedSecret = CryptoInteractor.calculateSharedSecretA(NativeAlicePrekeyBundle, NativeBobPrekeyBundle);
    var associatedData = CryptoInteractor.calculateAssociatedData(NativeAlicePrekeyBundle, NativeBobPrekeyBundle);
    var rachetState = CryptoInteractor.rachetInitAlice(sharedSecret, NativeBobPrekeyBundle);
    hexifyRachetStateObj(rachetState);

    // Save rachet state to database
    SessionModel.create({
      userID: userID,
      deviceID: deviceID,
      state: SystemConstant.SESSION_STATE.active,
      rachetState: rachetState,
      associatedData: bufferToHex(associatedData),
    })
    
    // Encrypt (IKa || IKb) with shared secret then send to Bob to verify the session.
    var ciphertext = CryptoInteractor.innerEncrypt(sharedSecret, associatedData, associatedData);
    console.log(bufferToHex(associatedData));
    console.log(bufferToHex(ciphertext));
    console.log(bufferToHex(sharedSecret));
    console.log(bufferToHex(CryptoInteractor.innerDecrypt(sharedSecret, associatedData, associatedData)));
    console.log(bufferToHex(CryptoInteractor.innerDecrypt(sharedSecret, ciphertext, associatedData)));
    console.log("...")
    console.log("...")
    console.log("...")
    console.log("...")
    
    return {
      type: SystemConstant.MESSAGE_TYPE.initial,
      header: JSON.stringify(
        headerSchema.cast({
          aliceIdentityKey: bufferToHex(NativeAlicePrekeyBundle[NativeConstant.IDENTITY_KEY][NativeConstant.PUBLIC_KEY]),
          aliceEphemeralKey: bufferToHex(NativeAlicePrekeyBundle[NativeConstant.EPHEMERAL_KEY][NativeConstant.PUBLIC_KEY]),
          bobOneTimePrekey: bufferToHex(NativeBobPrekeyBundle[NativeConstant.ONETIME_PREKEY][NativeConstant.PUBLIC_KEY]),
        })
      ),
      message: bufferToHex(ciphertext),
      messageID: "null",
      receipientDeviceID: deviceID,
      error: "",
    };
  } 
  catch (err) {
    return {
      error: err
    }
  }
}

function encryptMessageInStoredSessions(userID, message, messageID, filteredDeviceIDs=[])
{
  var messageObjs = [];
  var deviceRecords = [];
  if (!filteredDeviceIDs.length)
    deviceRecords = DeviceModel.findAll({
                      userID: userID
                    });
  else 
    deviceRecords = filteredDeviceIDs
                      .map(filteredDeviceID => DeviceModel.findOne({ 
                                                userID: userID, 
                                                deviceID: filteredDeviceID 
                                              }))
                      .filter(filteredDeviceRecord => filteredDeviceRecord !== null);

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
          rachetState:nxtRachetState,
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

async function sendIntialMessageForNewDevices(userID, deviceIDs)
{ 
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

  // Create initial ciphertexts.
  var messageObjs = [];
  for (var deviceID of deviceIDs) {
    var {error, ...NativeBobPrekeyBundle} = await KeyAction.fetchPrekeyBundle(userID, deviceID);
    if (error) 
      return {
        error: error,
      }

    var {error, ...messageObj} = encryptIntialMessageNewSession(userID, deviceID, NativeBobPrekeyBundle);
    if (error) 
      return {
        error: error,
      }

    messageObjs.push(messageObj);
  }

  // Check input validity.
  var request = requestSchema.cast(messageObjs);

  // Get response
  var response = await ConversationApi.sendMessage(userID, request);
  var {
    error,
    responseData,
  } = parseResponse(responseSchema, response);

  return {
    ...responseData,
    error: error,
    responseStatus: response.status,
  }
}

async function sendMessageForStoredSessions(userID, message, messageID, filteredDeviceIDs=[])
{
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

  // Check input validity.
  var request = requestSchema.cast(
    encryptMessageInStoredSessions(
      userID,
      message,
      messageID,
      filteredDeviceIDs,
    )
  );

  // Get response
  var response = await ConversationApi.sendMessage(userID, request);
  var {
    error,
    responseData,
  } = parseResponse(responseSchema, response);

  return {
    ...responseData,
    error: error,
    responseStatus: response.status,
  }
}

export async function handleSendAndRetries(userID, message, messageID)
{
  var { error, responseStatus, ...responseData } = await sendMessageForStoredSessions(userID, message, messageID, []);

  if (error) {
    // If error is not related to adding new devices, we should exit.
    if (!(responseStatus && responseData && responseStatus === ApiConstant.STT_CONFLICT)) {
      return {
        error: error
      }
    }

    // Remove old devices
    var {error} = markDevicesAsStale(userID, responseData.oldDeviceIDs);
    if (error)
      return {
        error: error
      }
    
    // Send initial message for new devices
    var { error, responseStatus, ...responseData } = await sendIntialMessageForNewDevices(userID, responseData.newDeviceIDs);
    if (error && !(responseStatus && responseData && responseStatus === ApiConstant.STT_CONFLICT)) { // Ignore new devices added, we only care after we send actual message.
      return {
        error: error
      }
    }
    
    // Send message for new devices
    var { error, responseStatus, ...responseData } = await sendMessageForStoredSessions(userID, message, messageID, responseData.newDeviceIDs);
    if (error && !(responseStatus && responseData && responseStatus === ApiConstant.STT_CONFLICT)) { // Ignore new devices added, we only care after we send actual message next time.
      return {
        error: error,
      }
    }
  }

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
  
  // --------------------- Push message to the database ---------------------.
  var { _id:messageID, _data:newMessageRecord } = MessageModel.create({
                                                    userID: data.receipientUserID,
                                                    message: data.message,
                                                    side: SystemConstant.CHAT_SIDE_TYPE.our,
                                                    timestamp: Date.now()
                                                  });
  

  // --------------------- Request send to the UserID's mailbox ---------------------.
  var { error } = handleSendAndRetries(data.receipientUserID, data.message, messageID);
  if (error) {
    return {
      error: error
    }
  }

  // --------------------- Request send to the our other devices' mailbox ---------------------.
  var { error } = handleSendAndRetries(getLocalStorage(StorageConstant.USER_ID), data.message, messageID);
  if (error) {
    return {
      error: error
    }
  }

  return {
    error: ""
  }
}

// ==============================================================================================================
//                                             DECRYPTION 
// ==============================================================================================================

async function handleNewMessages(messages)
{
  for (var message of messages) {
    // If message is normal, put it into database first.
    if (message.type === SystemConstant.MESSAGE_TYPE.normal) {
      // CipherModel.create(message);
      continue;
    }

    // Else, verify key from the other side & create a new session.
    if (message.type === SystemConstant.MESSAGE_TYPE.initial) {
      // Parse JSON header.
      var header;
      var headerSchema = object({
        aliceIdentityKey: string().required(),
        aliceEphemeralKey: string().required(),
        bobOneTimePrekey: string().default(""),
      });

      try {
        header = JSON.parse(message.header);
        header = headerSchema.validateSync(header);
      }
      catch {
        continue;
      }
      
      // Fetch Bob's key, check if it exists.
      var bobIdentityKeyRecord = PrekeyModel.findOne({ keyType: SystemConstant.KEY_TYPE.identity });
      var bobSignedPrekeyRecord = PrekeyModel.findOne({ keyType: SystemConstant.KEY_TYPE.signedPrekey });
      // var bobOneTimePrekeyRecord = PrekeyModel.findOneAndRemove({ 
      var bobOneTimePrekeyRecord = 
        header.bobOneTimePrekey === "" // todo: change to !==
          ? PrekeyModel.findOne({ 
              keyType: SystemConstant.KEY_TYPE.onetimePrekey,
              publicKey: header.bobOneTimePrekey,
            })
          : "";
      
      if (bobOneTimePrekeyRecord === null || bobSignedPrekeyRecord === null || bobIdentityKeyRecord === null) {
        continue
      }

      // Create alice's and bob's key
      var NativeAlicePrekeyBundle = CryptoInteractor.getNativeAlicePrekeyBundle(
        header.aliceIdentityKey,
        header.aliceEphemeralKey, 
      );

      var NativeBobPrekeyBundle = CryptoInteractor.getNativeBobPrekeyBundle(
        bobIdentityKeyRecord.publicKey,
        bobSignedPrekeyRecord.publicKey,
        bobSignedPrekeyRecord.signature,
        bobOneTimePrekeyRecord !== "" ? bobOneTimePrekeyRecord.publicKey : "",
      )

      // Calculates associated data, shared secret & decrypt message
      var associatedData = CryptoInteractor.calculateAssociatedData(NativeAlicePrekeyBundle, NativeBobPrekeyBundle);
      var sharedSecret = CryptoInteractor.calculateSharedSecretB(NativeBobPrekeyBundle, NativeAlicePrekeyBundle);
      var initialMessage = CryptoInteractor.innerDecrypt(sharedSecret, hexToBuffer(message.message), associatedData);
      
      console.log(initialMessage)
      console.log(associatedData)
      if (initialMessage === associatedData) {
        console.log("successful decrypt!");
      }
    }
  }
}

export async function periodicallyPullMessages()
{
  // Create schema
  var responseSchema = object({
    error: string().default(""),
    messages: array().of(object({
      type: number().oneOf(Object.values(SystemConstant.MESSAGE_TYPE)),
      header: string().required(),
      message: string().required(),
      messageID: string().required(),
      timestamp: number().required(),
      sendUserID: string().required(),
      sendDeviceID: string().required(),
    })).default([])
  });

  while (true) {
    // Get API call result
    var response = await ConversationApi.fetchMessages();
    var {
      error, 
      responseData
    } = parseResponse(responseSchema, response);

    if (!error) {
      await handleNewMessages(responseData.messages)
      break;
    } 
    // If server's timeout.
    else if (response.problem === ApiConstant.PROB_TIMEOUT_ERROR) {
      console.log("Server is timeout, which is fine...");
    }
    // If server dies or something...
    else {
      console.error(error);
      await new Promise(r => setTimeout(r, 30000));
    }

    await new Promise(r => setTimeout(r, 1000));
  }
}