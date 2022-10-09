const { object, string, number } = require("yup");
const { SystemConstant } = require("../const");
const BaseModel = require('./base.model');

const sessionSchema = object({
  userID: string().required(),
  deviceID: string().required(),
  serializedRachetState: string().required(),
  state: number().required().oneOf(Object.values(SystemConstant.SESSION_STATE))
});

module.exports = BaseModel.generate(sessionSchema, "session");