const { BrowserWindow } = require("@electron/remote");

const getWindow = () => BrowserWindow.getFocusedWindow();

const closeWindow = () => { 
  getWindow().close() 
};

const minimizeWindow = () => { 
  getWindow().minimize() 
};

const maximizeWindow = () => {
  let window = getWindow();
  window.isMaximized() ? window.unmaximize() : window.maximize();
}

module.exports = {
  closeWindow,
  minimizeWindow,
  maximizeWindow
};