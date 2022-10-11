const { object, string, number } = require("yup");
const { SystemConstant } = require("../const");
const BaseModel = require('./base.model');

const cipherSchema = object({
  type: number().oneOf(Object.values(SystemConstant.MESSAGE_TYPE)),
  header: string().required(),
  message: string().required(),
  messageID: string().required(),
  timestamp: number().required(),
  sendUserID: string().required(),
  sendDeviceID: string().required(),
  receiveUserID: string().required(),
})

module.exports = BaseModel.generate(cipherSchema, "cipher");