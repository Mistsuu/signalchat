import { StorageConstant }  from "const";

export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorage = (key, defaultValue = null) => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : defaultValue;
};

export const rmLocalStorage = key => {
  localStorage.removeItem(key);
};

// Only when data is required at lookup, then we define here!
export const getDeviceID = () => {
  if (getLocalStorage(StorageConstant.DEVICE_ID) === null)
    setLocalStorage(StorageConstant.DEVICE_ID, crypto.randomUUID());
  return getLocalStorage(StorageConstant.DEVICE_ID);
}