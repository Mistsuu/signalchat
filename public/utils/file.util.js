const fs = require("fs");

const createFolder = (folderName) => {
  if (!fs.existsSync(folderName)) {
    try {
      fs.mkdirSync(folderName);
    } catch (err) {
      throw(`Cannot create folder "${folderName}"! Error: ${err}`);
    }
  } else if (!fs.lstatSync(folderName).isDirectory()) {
    throw(`Cannot create folder "${folderName}"! There is a file/sth else exists with the same name!`);
  }
} 

module.exports = {
  createFolder,
}