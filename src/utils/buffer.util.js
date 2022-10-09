export const bufferToHex = (buffer) => {
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

export const getApproxString = (inputStr, trimLen=20) => {
  if (inputStr.length <= trimLen)
    return inputStr
  return inputStr.substring(0, trimLen) + "...";
}