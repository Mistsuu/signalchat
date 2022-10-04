const { randomBytes } = require("crypto");

const buffer2Hex = (buf) => {
  return Buffer.from(buf).toString("hex");
}

const hex2Buffer = (hex) => {
  return Uint8Array.from(Buffer.from(hex, "hex"));
}

const randomBufHex = (nbytes) => {
  return buffer2Hex(randomBytes(nbytes));
}

module.exports = {
  buffer2Hex,
  hex2Buffer,
  randomBufHex,
}