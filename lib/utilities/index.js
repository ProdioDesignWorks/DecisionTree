'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDefined = exports.isString = exports.isArray = exports.isObject = exports.isNull = exports.isEmpty = undefined;

var _is = require('is');

var _is2 = _interopRequireDefault(_is);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isEmpty = exports.isEmpty = function isEmpty(obj) {
  return _is2.default.object(obj) && _is2.default.empty(obj);
};
var isNull = exports.isNull = function isNull(obj) {
  return _is2.default.nil(obj);
};
var isObject = exports.isObject = function isObject(obj) {
  return _is2.default.object(obj);
};
var isArray = exports.isArray = function isArray(arr) {
  return _is2.default.array(arr);
};
var isString = exports.isString = function isString(str) {
  return _is2.default.string(str);
};
var isDefined = exports.isDefined = function isDefined(val) {
  return _is2.default.defined(val);
};