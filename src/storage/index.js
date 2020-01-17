import fs from 'fs';
import { MODEL_PATH } from '../constants';
import { log } from '../utilities';

const fileExists = (fp) => {
  try {
    fs.accessSync(fp, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
};
const createFile = fp => fs.closeSync(fs.openSync(fp, 'w'));
const writeFile = (fp, data) => fs.writeFileSync(fp, data);
const readFile = (fp, isJson = false) => (isJson ? JSON.parse(fs.readFileSync(fp, 'utf8')) : fs.readFileSync(fp, 'utf8'));

export const persistModel = (modelJson = {}, debug = false) => {
  debug && log(`Model file path: ${MODEL_PATH}`);
  const exists = fileExists(MODEL_PATH);
  debug && log(`Model file exists: ${exists}`);
  writeFile(MODEL_PATH, JSON.stringify(modelJson));
  if (exists) {
    	writeFile(MODEL_PATH, JSON.stringify(modelJson));
    debug && log('Model persisted');
  } else {
    debug && log('Model file created');
    writeFile(MODEL_PATH, JSON.stringify(modelJson));
    debug && log('Model persisted');
  }
};
export const loadModel = (debug = false) => {
  debug && log(`Model file path: ${MODEL_PATH}`);
  const exists = fileExists(MODEL_PATH);
  debug && log(`Model file exists: ${exists}`);
  return exists ? readFile(MODEL_PATH, true) : {};
};
