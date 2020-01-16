import is from 'is';

export const isEmpty = obj => is.object(obj) && is.empty(obj);
export const isNull = obj => is.nil(obj);
export const isObject = obj => is.object(obj);
export const isArray = arr => is.array(arr);
export const isString = str => is.string(str);
export const isDefined = val => is.defined(val);
