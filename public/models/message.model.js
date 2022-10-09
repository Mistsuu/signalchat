const { object, string, number } = require("yup");
const BaseModel = require('./base.model');

const messageSchema = object({

});

module.exports = BaseModel.generate(messageSchema, "message");