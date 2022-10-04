export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorage = (key, defaultValue = null) => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : defaultValue;
};

export const removeLocalStorage = key => {
  localStorage.removeItem(key);
};