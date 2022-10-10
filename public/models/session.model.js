const { object, string, number, array } = require("yup");
const crypto = require("crypto");
const { SystemConstant, NativeConstant } = require("../const");
const BaseModel = require('./base.model');

const sessionSchema = object({
  userID: string().required(),
  deviceID: string().required(),
  sessionID: string().default(crypto.randomBytes(16).toString("hex")),
  state: number().required().oneOf(Object.values(SystemConstant.SESSION_STATE)),
  
  // Data used in Double Rachet
  rachetState: object({
    [NativeConstant.DHSEND]: object({
                              [NativeConstant.PUBLIC_KEY]: string().required(),
                              [NativeConstant.PRIVATE_KEY]: string().required()
                             }).required(),
    [NativeConstant.DHRECV]: string(),
    [NativeConstant.ROOTKEY]: string().required(),
    [NativeConstant.CHAINKEYSEND]: string(),
    [NativeConstant.CHAINKEYRECV]: string(),
    [NativeConstant.IMESSSEND]: number().required(),
    [NativeConstant.IMESSRECV]: number().required(),
    [NativeConstant.PREVCHAINLEN]: number().required(),
    [NativeConstant.SKIPPEDKEYS]: array().of(object({
                                              [NativeConstant.DHPUBLIC]: string().required(),
                                              [NativeConstant.IMESS]: number().required(),
                                              [NativeConstant.MESSAGEKEY]: string().required(),
                                             })).default([]),
  }).required(),
  associatedData: string().required(),
});

module.exports = BaseModel.generate(sessionSchema, "session");