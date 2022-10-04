const { 
  SignalProto_Native 
} = require("bindings")("SignalChat_Native");

const {
  SIGNED_PREKEY,
  IDENTITY_KEY,
} = require("../const/native.const");

const SignalProto_NativeObj = new SignalProto_Native();

//
//  returns
//  {
//      publicKey: {Buffer[32]},       
//      privateKey: {Buffer[32]},       
//  }
//
const generateKeyPair = () => {
  return SignalProto_NativeObj.generateKeyPair();
}

//
//  @param privateKey {Buffer}
//  @param input {Buffer}
//  returns {Buffer}
//
const calculateSignature = (privateKey, input) => {
  return SignalProto_NativeObj.calculateSignature(privateKey, input);
}


//  
//  @param publicKey {Buffer}
//  @param input {Buffer}
//  @param signature {Buffer}
//  returns {Boolean}
//
const verifySignature = (publicKey, input, signature) => {
  return SignalProto_NativeObj.verifySignature(publicKey, input, signature);
}

//
//  @param alicePrekeyBundle { identityKey {Buffer}, ephemeralKey {Buffer} }
//  @param bobPrekeyBundle { identityKey {Buffer}, signedPreKey {Buffer}, ..., oneTimePreKey {Buffer} }
//  returns {Buffer}
//
const calculateSharedSecretA = (alicePrekeyBundle, bobPrekeyBundle) => {
  return SignalProto_NativeObj.calculateSharedSecretA(alicePrekeyBundle, bobPrekeyBundle);
}

//
//  @param bobPrekeyBundle { identityKey {Buffer}, signedPreKey {Buffer}, ..., oneTimePreKey {Buffer} }
//  @param alicePrekeyBundle { identityKey {Buffer}, ephemeralKey {Buffer} }
//  returns {Buffer}
//
const calculateSharedSecretB = (bobPrekeyBundle, alicePrekeyBundle) => {
  return SignalProto_NativeObj.calculateSharedSecretB(bobPrekeyBundle, alicePrekeyBundle);
}

//
//  @param sharedSecret {Buffer}
//  @param bobPrekeyBundle { ..., signedPreKey {Buffer}, ... }
//  returns ...
//
const rachetInitAlice = (sharedSecret, bobPrekeyBundle) => {
  return SignalProto_NativeObj.rachetInitAlice(
                                sharedSecret, bobPrekeyBundle[SIGNED_PREKEY]
                               );
}

//
//  @param sharedSecret {Buffer}
//  @param bobPrekeyBundle { ..., signedPreKey {Buffer}, ... }
//  returns ...
//
const rachetInitBob = (sharedSecret, bobPrekeyBundle) => {
  return SignalProto_NativeObj.rachetInitBob(
                                sharedSecret, bobPrekeyBundle[SIGNED_PREKEY]
                               );
}

//
//  @param alicePrekeyBundle { identityKey {Buffer}, ... }
//  @param bobPrekeyBundle { identityKey {Buffer}, ... }
//  returns {Buffer}
//
const calculateAssociatedData = (alicePrekeyBundle, bobPrekeyBundle) => {
  return SignalProto_NativeObj.calculateAssociatedData(
                                alicePrekeyBundle[IDENTITY_KEY], 
                                bobPrekeyBundle[IDENTITY_KEY]
                               );
}

//
//  @param rachetState ...
//  @param plaintext {Buffer}
//  @param associatedData {Buffer}
//  returns ...
//
const signalEncrypt = (rachetState, plaintext, associatedData) => {
  return SignalProto_NativeObj.signalEncrypt(rachetState, plaintext, associatedData);
}

//
//  @param rachetState ...
//  @param rachetHeader ...
//  @param ciphertext {Buffer}
//  @param associatedData {Buffer}
//  returns ...
//
const signalDecrypt = (rachetState, rachetHeader, ciphertext, associatedData) => {
  return SignalProto_NativeObj.signalDecrypt(rachetState, rachetHeader, ciphertext, associatedData);
}

module.exports = {
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
}