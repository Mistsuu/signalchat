const { object, string, number } = require("yup");
const { SystemConstant } = require("../const");
const BaseModel = require('./base.model');

const prekeySchema = object({
  keyType: number().required().oneOf(Object.values(SystemConstant.KEY_TYPE)),
  key: string().required(),
  signature: string().default(""),
});

module.exports = BaseModel.generate(prekeySchema, "prekey");