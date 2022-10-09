const { object, string, number } = require("yup");
const { SystemConstant } = require("../const");
const BaseModel = require('./base.model');

const deviceSchema = object({
  userID: string().required(),
  deviceID: string().required(),
  identityKey: string(). required(),
  state: number().required().oneOf(Object.values(SystemConstant.DEVICE_STATE)),
});

module.exports = BaseModel.generate(deviceSchema, "device");