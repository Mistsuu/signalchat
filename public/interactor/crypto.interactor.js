const SignalChat_Native = require("bindings")("SignalChat_Native");

const hello = () => {
    console.log(SignalChat_Native.hello());
}

module.exports = {
    hello
}