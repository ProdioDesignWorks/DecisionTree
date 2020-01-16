'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MODEL_PATH = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MODEL_NAME = 'model.json';
var MODELS_PATH = _path2.default.resolve(__dirname, '..', '..', 'models');

var MODEL_PATH = exports.MODEL_PATH = _path2.default.resolve(MODELS_PATH, MODEL_NAME);