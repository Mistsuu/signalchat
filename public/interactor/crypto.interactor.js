const { SignalProto_Native } = require("bindings")("SignalChat_Native");

var obj = new SignalProto_Native();
console.log(obj.GeneratePreKeyBundle());

module.exports = {
    SignalProto_Native
}