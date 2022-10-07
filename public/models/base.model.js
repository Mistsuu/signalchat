const jsonfile = require("jsonfile");
const { object, string } = require("yup");
const crypto = require("crypto");
const StringFormat = require("string-format");
const { AppConstant, TxtConstant } = require("../const");
const { createFolder } = require("../utils/file.util");

const getJSONData = (dbFilepath) => {
  // Pull JSON data out of memory.
  var jsonData = [];
  try {
    jsonData = jsonfile.readFileSync(dbFilepath);
  }
  catch (err) {}
  return jsonData;
}

const findOneInArray = (array, constraints) => {
  if (!(array) instanceof Array)
    return null;

  for (var index in array) {
    if (array[index] instanceof Object) {
      var found = true;
  
      for (var key of Object.keys(array[index])) {
        if (Object.keys(constraints).includes(key)) {
          if (array[index][key] !== constraints[key]) {
            found = false;
            break;
          }
        }
      }
  
      if (found) {
        return index;
      }
    }
  }

  return null;
}

const findOneInDBArray = (array, constraints) => {
  if (!(array) instanceof Array)
    return null;

  for (var index in array) {
    if (array[index]._data instanceof Object) {
      var found = true;
  
      for (var key of Object.keys(array[index]._data)) {
        if (Object.keys(constraints).includes(key)) {
          if (array[index]._data[key] !== constraints[key]) {
            found = false;
            break;
          }
        }
      }
  
      if (found) {
        return index;
      }
    }
  } 

  return null;
}

const findAllInDBArray = (array, constraints) => {
  if (!(array) instanceof Array)
    return [];

  var indices = [];
  for (var index in array) {
    if (array[index]._data instanceof Object) {
      var found = true;
  
      for (var key of Object.keys(array[index]._data)) {
        if (Object.keys(constraints).includes(key)) {
          if (array[index]._data[key] !== constraints[key]) {
            found = false;
            break;
          }
        }
      }
  
      if (found) {
        indices.push(index);
      }
    }
  }

  return indices;
}

const create = async (model, dbFilepath, obj) => {
  const parsedObj = await model.validate({
    _id: crypto.randomBytes(16).toString("hex"),
    _data: obj
  });

  // Get JSON data (wrapped to handle file not exist!)
  var jsonData = getJSONData(dbFilepath);
  
  // Append new data to object
  jsonData.push(parsedObj);

  // Overwrite data to old file syncronously (hope so).
  jsonfile.writeFileSync(dbFilepath, jsonData);
  return parsedObj;
}

const findOne = (dbFilepath, constraints) => {
  if (!(constraints instanceof Object))
    return null;

  var jsonData = getJSONData(dbFilepath);
  var index = findOneInDBArray(jsonData, constraints);
  return index === null ? null : jsonData[index]._data;
}

const findAll = (dbFilepath, constraints) => {
  if (!(constraints instanceof Object))
    return [];

  var jsonData = getJSONData(dbFilepath);
  var indices = findAllInDBArray(jsonData, constraints);
  return indices.map(index => jsonData[index]._data);
}

const findOneById = (dbFilepath, id) => {
  var jsonData = getJSONData(dbFilepath);
  for (var item of jsonData) {
    if (item._id === id) {
      return item._data;
    }
  }
  return null;
}

const findOneAndUpdateSet = async (model, dbFilepath, constraints, setValues) => {
  if (!(setValues instanceof Object))
    return null;

  // Find an item.
  var jsonData = getJSONData(dbFilepath);
  var index = findOneInDBArray(jsonData, constraints);
  if (index === null)
    return null;
    
  // Get keys
  var item = jsonData[index];
  for (var key of Object.keys(setValues)) {
    item._data[key] = setValues[key];
  }

  // Parse item before sending data off.
  var parsedItem = await model.validate(item);
  jsonData[index] = parsedItem;

  // Write data & return new object.
  jsonfile.writeFileSync(dbFilepath, jsonData);
  return parsedItem._data;
};

const findOneAndUpdatePush = async (model, dbFilepath, constraints, pushValues) => {
  if (!(pushValues instanceof Object))
    return null;

  // Find an item.
  var jsonData = getJSONData(dbFilepath);
  var index = findOneInDBArray(jsonData, constraints);
  if (index === null)
    return null;

  // Get keys
  var item = jsonData[index];
  for (var key of Object.keys(pushValues)) {
    if (pushValues[key] instanceof Array) {
      if (item._data.hasOwnProperty(key)) {
        item._data[key].push.apply(item._data[key], pushValues[key]);
      } else {
        item._data[key] = pushValues[key];
      }
    } else {
      if (item._data.hasOwnProperty(key)) {
        item._data[key].push(pushValues[key]);
      } else {
        item._data[key] = [pushValues[key]];
      }
    }
  }

  // Parse item before sending data off.
  var parsedItem = await model.validate(item);
  jsonData[index] = parsedItem;

  // Write data & return new object.
  jsonfile.writeFileSync(dbFilepath, jsonData);
  return parsedItem._data;
};

const findOneAndRemove = async (dbFilepath, constraints) => {
  // Find an item.
  var jsonData = getJSONData(dbFilepath);
  var index = findOneInDBArray(jsonData, constraints);
  if (index === null)
    return null;
    
  // Write data & return new object.
  jsonData.splice(index, 1);
  jsonfile.writeFileSync(dbFilepath, jsonData);
};

const findOneAndUpdatePop = async (dbFilepath, constraints, popConstraints) => {
  if (!(popConstraints instanceof Object))
    return null;

  // Find an item.
  var jsonData = getJSONData(dbFilepath);
  var index = findOneInDBArray(jsonData, constraints);
  if (index === null)
    return null;

  // Splice items
  var item = jsonData[index];
  for (var key of Object.keys(popConstraints)) {
    var popIndex = findOneInArray(item._data[key], { [key]:popConstraints[key] });
    if (popIndex === null)
      continue;
    item._data[key].splice(popIndex, 1);
  }

  // Write to database
  jsonData[index] = item;
  jsonfile.writeFileSync(dbFilepath, jsonData);
  return item._data;
}


const generate = (model, dbName) => {
  // Set database filepath
  var dbFilepath = StringFormat(TxtConstant.FM_DB_PATH, AppConstant.DB_FOLDERPATH, dbName);
  createFolder(AppConstant.DB_FOLDERPATH);

  // Set model
  var model = object({
    _id: string().required(),
    _data: model
  });

  // Return a set of functions
  return {
    create: (obj) => create(model, dbFilepath, obj),
    findOne: (constraints) => findOne(dbFilepath, constraints),
    findAll: (constraints) => findAll(dbFilepath, constraints),
    findOneById: (id) => findOneById(dbFilepath, id),
    findOneAndRemove: (constrants) => findOneAndRemove(dbFilepath, constrants),
    findOneAndUpdatePop: (constraints, popConstraints) => findOneAndUpdatePop(dbFilepath, constraints, popConstraints),
    findOneAndUpdateSet: (constraints, setValues) => findOneAndUpdateSet(model, dbFilepath, constraints, setValues),
    findOneAndUpdatePush: (constraints, pushValues) => findOneAndUpdatePush(model, dbFilepath, constraints, pushValues),
  }
}


module.exports = {
  generate
};