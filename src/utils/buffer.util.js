export const bufferToHex = (buffer) =>
  [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');

export const hexToBuffer = (hexString) => 
  Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

export const getApproxString = (inputStr, trimLen=15) => {
  if (inputStr.length <= trimLen)
    return inputStr
  return inputStr.substring(0, trimLen) + "...";
}