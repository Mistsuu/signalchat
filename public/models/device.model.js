const { object, string, number } = require("yup");
const BaseModel = require('./base.model');

const deviceSchema = object({

});

module.exports = BaseModel.generate(deviceSchema, "device");