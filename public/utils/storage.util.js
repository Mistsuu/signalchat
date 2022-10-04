const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getLocalStorage = (key, defaultValue = null) => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : defaultValue;
};

const rmLocalStorage = key => {
  localStorage.removeItem(key);
};

module.exports = {
  setLocalStorage,
  getLocalStorage,
  rmLocalStorage,
}