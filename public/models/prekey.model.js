const { object, string, array } = require("yup");
const BaseModel = require('./base.model');

const prekeySchema = object({
  userID: string().required(),
  deviceID: string().required(),
  identityKey: string().required(),
  signedPrekey: string().required(),
  onetimePrekeys: array().of(object({ keyID: string().required(), key: string().required() })).default([]),
});

const prekeyModel = BaseModel.generate(prekeySchema, "prekey");
module.exports = prekeyModel;