const buffer2Hex = (buf) => {
  return Buffer.from(buf).toString("hex");
}

const hex2Buffer = (hex) => {
  return Uint8Array.from(Buffer.from(hex, "hex"));
}

module.exports = {
  buffer2Hex,
  hex2Buffer
}