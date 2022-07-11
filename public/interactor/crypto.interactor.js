const { SignalProto_Native } = require("bindings")("SignalChat_Native");

const SignalProto_NativeObj = new SignalProto_Native();

//
//  returns
//  Object {
//      publicKey: Uint8Array[32],       
//      privateKey: Uint8Array[32],       
//  }
//
const generateKeyPair = () => {
    try {
        return Promise.resolve(SignalProto_NativeObj.generateKeyPair());
    } catch (err) {
        return Promise.reject(err);
    } 
}

//
//  @param privateKey {Buffer}
//  @param input {Buffer}
//  returns Buffer
//
const calculateSignature = (privateKey, input) => {
    try {
        return Promise.resolve(SignalProto_NativeObj.calculateSignature(privateKey, input));
    } catch (err) {
        return Promise.reject(err);
    } 
}


//  
//  @param publicKey {Buffer}
//  @param input {Buffer}
//  @param signature {Buffer}
//  returns Boolean
//
const verifySignature = (publicKey, input, signature) => {
    try {
        return Promise.resolve(SignalProto_NativeObj.verifySignature(publicKey, input, signature));
    } catch (err) {
        return Promise.reject(err);
    } 
}

//
//  @param aliceKeyBundle { identityKey {Buffer}, ephemeralKey {Buffer} }
//  @param bobKeyBundle { identityKey {Buffer}, signedPreKey {Buffer}, oneTimePreKey {Buffer} }
//  returns Buffer
//
const calculateSharedSecretA = async (aliceKeyBundle, bobKeyBundle) => {
    try {
        return Promise.resolve(SignalProto_NativeObj.calculateSharedSecretA(aliceKeyBundle, bobKeyBundle))
    } catch (err) {
        return Promise.reject(err);
    }
}

//
//  @param bobKeyBundle { identityKey {Buffer}, signedPreKey {Buffer}, oneTimePreKey {Buffer} }
//  @param aliceKeyBundle { identityKey {Buffer}, ephemeralKey {Buffer} }
//  returns Buffer
//
const calculateSharedSecretB = async (bobKeyBundle, aliceKeyBundle) => {
    try {
        return Promise.resolve(SignalProto_NativeObj.calculateSharedSecretB(bobKeyBundle, aliceKeyBundle))
    } catch (err) {
        return Promise.reject(err);
    }
}

module.exports = {
    generateKeyPair,
    calculateSignature,
    verifySignature,
    calculateSharedSecretA,
    calculateSharedSecretB,
}