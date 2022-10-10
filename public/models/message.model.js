const { object, string, number } = require("yup");
const { SystemConstant } = require("../const");
const BaseModel = require('./base.model');

const messageSchema = object({
  userID: string().required(),
  message: string().required(),
  timestamp: number().required(),
  side: number().required().oneOf(Object.values(SystemConstant.CHAT_SIDE_TYPE)),
});

module.exports = BaseModel.generate(messageSchema, "message");