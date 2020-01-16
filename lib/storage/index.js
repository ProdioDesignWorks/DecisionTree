'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadModel = exports.persistModel = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fileExists = function fileExists(fp) {
    try {
        _fs2.default.accessSync(fp, _fs2.default.constants.F_OK);
        return true;
    } catch (error) {
        return false;
    }
};
var createFile = function createFile(fp) {
    return _fs2.default.closeSync(_fs2.default.openSync(fp, 'w'));
};
var writeFile = function writeFile(fp, data) {
    return _fs2.default.writeFileSync(fp, data);
};
var readFile = function readFile(fp) {
    var isJson = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return isJson ? JSON.parse(_fs2.default.readFileSync(fp, 'utf8')) : _fs2.default.readFileSync(fp, 'utf8');
};

var persistModel = exports.persistModel = function persistModel() {
    var modelJson = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    debug && console.log("Model file path:", _constants.MODEL_PATH);
    var exists = fileExists(_constants.MODEL_PATH);
    debug && console.log("Model file exists:", exists);
    writeFile(_constants.MODEL_PATH, JSON.stringify(modelJson));
    if (exists) {
        writeFile(_constants.MODEL_PATH, JSON.stringify(modelJson));
        debug && console.log('Model persisted');
    } else {
        debug && console.log("Model file created");
        writeFile(_constants.MODEL_PATH, JSON.stringify(modelJson));
        debug && console.log('Model persisted');
    }
};
var loadModel = exports.loadModel = function loadModel() {
    var debug = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    debug && console.log("Model file path:", _constants.MODEL_PATH);
    var exists = fileExists(_constants.MODEL_PATH);
    debug && console.log("Model file exists:", exists);
    return exists ? readFile(_constants.MODEL_PATH, true) : {};
};