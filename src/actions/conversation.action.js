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
    console.log(err)
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

async function sendIntialMessageForNewDevices(userID, deviceIDs, targetUserID)
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
  var response = await ConversationApi.sendMessage(userID, targetUserID, request);
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

async function sendMessageForStoredSessions(userID, message, messageID, targetUserID, filteredDeviceIDs=[])
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
  var response = await ConversationApi.sendMessage(userID, targetUserID, request);
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

export async function handleSendAndRetries(userID, message, messageID, targetUserID)
{
  var { error, responseStatus, ...responseData } = await sendMessageForStoredSessions(userID, message, messageID, targetUserID, []);

  if (error) {
    // If error is not related to adding new devices, we should exit.
    if (!(responseStatus && responseData && responseStatus === ApiConstant.STT_CONFLICT)) {
      return {
        error: error
      }
    }

    // Remove old devices
    var oldDeviceIDs = responseData.oldDeviceIDs;
    var newDeviceIDs = responseData.newDeviceIDs;
    var {error} = markDevicesAsStale(userID, oldDeviceIDs);
    if (error)
      return {
        error: error
      }
    
    // Send initial message for new devices
    var { error, responseStatus, ...responseData } = await sendIntialMessageForNewDevices(userID, newDeviceIDs, targetUserID);
    if (error && !(responseStatus && responseData && responseStatus === ApiConstant.STT_CONFLICT)) { // Ignore new devices added, we only care after we send actual message.
      return {
        error: error
      }
    }
    
    // Send message for new devices
    var { error, responseStatus, ...responseData } = await sendMessageForStoredSessions(userID, message, messageID, targetUserID, newDeviceIDs);
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
  var { error } = handleSendAndRetries(data.receipientUserID, data.message, messageID, data.receipientUserID);
  if (error) {
    return {
      error: error
    }
  }

  // --------------------- Request send to the our other devices' mailbox ---------------------.
  if (getLocalStorage(StorageConstant.USER_ID) !== data.receipientUserID) {
    var { error } = handleSendAndRetries(getLocalStorage(StorageConstant.USER_ID), data.message, messageID, data.receipientUserID);
    if (error) {
      return {
        error: error
      }
    }
  }

  return {
    error: ""
  }
}

// ==============================================================================================================
//                                             DECRYPTION 
// ==============================================================================================================

function handleIntialMessage(message)
{
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
    return;
  }

  // Verify Alice's identity
  const deviceRecord = DeviceModel.findOne({
    userID: message.sendUserID,
    deviceID: message.sendDeviceID,
  });

  if (deviceRecord === null) {
    DeviceModel.create({
      userID: message.sendUserID,
      deviceID: message.sendDeviceID,
      identityKey: header.aliceIdentityKey,
      state: SystemConstant.DEVICE_STATE.active,
    })
  }
  else if (deviceRecord.identityKey !== header.aliceIdentityKey) {
    return;
  }

  // Fetch Bob's key, check if it exists.
  var bobIdentityKeyRecord = PrekeyModel.findOne({ keyType: SystemConstant.KEY_TYPE.identity });
  var bobSignedPrekeyRecord = PrekeyModel.findOne({ keyType: SystemConstant.KEY_TYPE.signedPrekey });
  var bobOneTimePrekeyRecord = 
    header.bobOneTimePrekey !== ""
      ? PrekeyModel.findOneAndRemove({ 
          keyType: SystemConstant.KEY_TYPE.onetimePrekey,
          publicKey: header.bobOneTimePrekey,
        })
      : "";

  if (bobOneTimePrekeyRecord === null || bobSignedPrekeyRecord === null || bobIdentityKeyRecord === null) {
    return;
  }

  // Create alice's and bob's key
  var NativeAlicePrekeyBundle = CryptoInteractor.getNativeAlicePrekeyBundle(
    header.aliceIdentityKey,
    header.aliceEphemeralKey, 
  );

  var NativeBobPrekeyBundle = CryptoInteractor.getFullNativeBobPrekeyBundle(
    bobIdentityKeyRecord.publicKey,
    bobIdentityKeyRecord.privateKey,

    bobSignedPrekeyRecord.publicKey,
    bobSignedPrekeyRecord.privateKey,
    bobSignedPrekeyRecord.signature,

    bobOneTimePrekeyRecord !== "" ? bobOneTimePrekeyRecord.publicKey : "",
    bobOneTimePrekeyRecord !== "" ? bobOneTimePrekeyRecord.privateKey : "",
  )

  // Calculates associated data, shared secret & decrypt message
  var associatedData = CryptoInteractor.calculateAssociatedData(NativeAlicePrekeyBundle, NativeBobPrekeyBundle);
  var sharedSecret = CryptoInteractor.calculateSharedSecretB(NativeBobPrekeyBundle, NativeAlicePrekeyBundle);
  var initialMessage;
  try {
    // Decrypt & verify initial message, which is the same as associated data.
    initialMessage = CryptoInteractor.innerDecrypt(sharedSecret, hexToBuffer(message.message), associatedData);
    if (bufferToHex(initialMessage) !== bufferToHex(associatedData))
      return;
  } 
  catch {
    return;
  }

  // Create rachet state
  var rachetState = CryptoInteractor.rachetInitBob(sharedSecret, NativeBobPrekeyBundle);
  hexifyRachetStateObj(rachetState)

  // Create session
  SessionModel.create({
    userID: message.sendUserID,
    deviceID: message.sendDeviceID,
    state: SystemConstant.SESSION_STATE.active,
    rachetState: rachetState,
    associatedData: bufferToHex(associatedData)
  })
}

function cacheUserDeviceData(cache, userID, deviceID, fetchCallback)
{
  if (!cache.hasOwnProperty(userID))
    cache[userID] = {}
  if (!cache[userID].hasOwnProperty(deviceID))
    cache[userID][deviceID] = fetchCallback(userID, deviceID);
  return cache[userID][deviceID]
}

function handleUndecryptedMessages()
{
  const cipherRecords = CipherModel.findAllWithId({});
  const cacheDeviceStates = {}
  const cacheSessionRecords = {}
  const ourUserID = getLocalStorage(StorageConstant.USER_ID);

  // ======================   Callbacks to pull data and modify it   ======================
  const getDeviceRecord = ( userID, deviceID ) => DeviceModel.findOne({
                                                    userID: userID,
                                                    deviceID: deviceID
                                                  })
  const getSessionRecords = ( userID, deviceID ) => {
                                var tmpRecords = SessionModel.findAllWithId({
                                  userID: userID,
                                  deviceID: deviceID
                                });

                                for (var index in tmpRecords) {
                                  unHexifyRachetStateObj(tmpRecords[index]._data.rachetState)
                                  tmpRecords[index]._data.associatedData = hexToBuffer(tmpRecords[index]._data.associatedData);
                                }

                                return tmpRecords;
                              }

  // ======================   Decrypting messages...   ======================
  for (var cipherRecordWithId of cipherRecords) {
    var { 
      _id:cipherRecordId, 
      _data:cipherRecord
    } = cipherRecordWithId;

    try {
      // Check device correspond to this messsage
      var deviceRecord = cacheUserDeviceData(
                            cacheDeviceStates, 
                            cipherRecord.sendUserID, 
                            cipherRecord.sendDeviceID,
                            getDeviceRecord
                          );
      if (deviceRecord === null || deviceRecord.state === SystemConstant.DEVICE_STATE.stale)
        continue;


      // Find all sessions with this userID / deviceID
      var sessionRecords = cacheUserDeviceData(
                              cacheSessionRecords,
                              cipherRecord.sendUserID, 
                              cipherRecord.sendDeviceID,
                              getSessionRecords
                            );

      // Pull rachetheader & ciphertext from records 
      var rachetHeader = CryptoInteractor.deserializeRachetHeader(hexToBuffer(cipherRecord.header));
      var ciphertext = hexToBuffer(cipherRecord.message);

      // Try decrypt message using record.
      for (var sessionRecord of sessionRecords) {
        var {
          rachetState:nxtRachetState,
          plaintext
        } = CryptoInteractor.signalDecrypt(
              sessionRecord._data.rachetState, 
              rachetHeader, 
              ciphertext,
              sessionRecord._data.associatedData
            );

        if (plaintext.length !== 0) {
          var theirUserID;
          if (cipherRecord.receiveUserID === ourUserID)
            theirUserID = cipherRecord.sendUserID;
          else 
            theirUserID = cipherRecord.receiveUserID;

          // Save message!
          MessageModel.create({
            userID: theirUserID,
            message: new TextDecoder().decode(plaintext),
            timestamp: cipherRecord.timestamp,
            side: cipherRecord.sendUserID === ourUserID ? SystemConstant.CHAT_SIDE_TYPE.our : SystemConstant.CHAT_SIDE_TYPE.their,
          })

          // Remove ciphertext!
          CipherModel.findOneByIdAndRemove(cipherRecordId);

          // Check if current session is active/inactive.
          if (sessionRecord._data.state === SystemConstant.SESSION_STATE.inactive) {
            // Set current session record to active
            sessionRecord._data.state = SystemConstant.SESSION_STATE.active;
  
            // Set other sessions to inactive
            for (var sessionRecordJ of sessionRecords) {
              if (sessionRecordJ._id !== sessionRecord._id) {
                sessionRecordJ._data.state = SystemConstant.SESSION_STATE.active;
              }
            }
          }

          // Update rachet state!
          sessionRecord._data.rachetState = nxtRachetState;
          break;
        }
      }
    }
    catch (err){
      console.error(err)
      continue;
    }
  }

  // ====================== Write the new rachetState into database. ======================

  for (var userID of Object.keys(cacheSessionRecords)) {
    for (var deviceID of Object.keys(cacheSessionRecords[userID])) {
      for (var sessionRecord of cacheSessionRecords[userID][deviceID]) {
        hexifyRachetStateObj(sessionRecord._data.rachetState);
        sessionRecord._data.associatedData = bufferToHex(sessionRecord._data.associatedData);
        SessionModel.findOneByIdAndUpdate(sessionRecord._id, {
          rachetState: sessionRecord._data.rachetState,
          state: sessionRecord._data.state,
        })
      }
    }
  }

}

async function handleNewMessages(messages)
{
  for (var message of messages) {
    // If message is normal, put it into database first.
    if (message.type === SystemConstant.MESSAGE_TYPE.normal) {
      // Create message.
      CipherModel.create(message);
      continue;
    }

    // Else, verify key from the other side & create a new session.
    if (message.type === SystemConstant.MESSAGE_TYPE.initial) {
      handleIntialMessage(message);
    }
  }

  // Then we're gonna handle these messages later.
  handleUndecryptedMessages();
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
      receiveUserID: string().required(),
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
      // Tell server that we received the message :3
      await ConversationApi.clearMessages();

      // Decrypt & write messages to database!
      await handleNewMessages(responseData.messages)
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

    await new Promise(r => setTimeout(r, 100));
  }
}


// ==============================================================================================================
//                                             FETCHES DATA 
// ==============================================================================================================

export async function fetchMessagesFromDB(userID)
{
  try {
    const messageRecords = MessageModel.findAll({ userID: userID });
    return messageRecords;
  }
  catch {
    return [];
  }
}

export async function fetchAllUsers()
{
  // Create schema
  const responseSchema = object({
    userIDs: array().of(string().required()).default([]),
    error: string().default(""),
  })

  // Check server respond
  var response = await ConversationApi.fetchUsers();
  var {
    error,
    responseData
  } = parseResponse(responseSchema, response);

  // Returns error.
  return {
    userIDs: !error? responseData.userIDs : null,
    error: error
  }
}