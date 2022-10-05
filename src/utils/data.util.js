export const objCheckIfKeyExists = (obj, keys=[]) => {
  for (var key of keys) {
    if (!obj.hasOwnProperty(key))
      return false;
  }
  return true;
}