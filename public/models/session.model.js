const { object, string, number } = require("yup");
const BaseModel = require('./base.model');

const sessionSchema = object({

});

module.exports = BaseModel.generate(sessionSchema, "session");