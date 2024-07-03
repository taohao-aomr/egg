"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlainObject = exports.isObjectObject = exports.isObject = exports.isClass = exports.isPromise = exports.isFunction = exports.isString = void 0;
function isString(arg) {
    return typeof arg === 'string';
}
exports.isString = isString;
function isFunction(arg) {
    return typeof arg === 'function';
}
exports.isFunction = isFunction;
function isPromise(arg) {
    return arg && 'function' === typeof arg.then;
}
exports.isPromise = isPromise;
function isClass(arg) {
    if (typeof arg !== 'function') {
        return false;
    }
    const fnStr = Function.prototype.toString.call(arg);
    return (fnStr.substring(0, 5) === 'class' ||
        Boolean(~fnStr.indexOf('classCallCheck(')) ||
        Boolean(~fnStr.indexOf('TypeError("Cannot call a class as a function")')));
}
exports.isClass = isClass;
function isObject(arg) {
    return arg !== null && typeof arg === 'object';
}
exports.isObject = isObject;
function isObjectObject(o) {
    return (isObject(o) &&
        Object.prototype.toString.call(o) === '[object Object]');
}
exports.isObjectObject = isObjectObject;
function isPlainObject(o) {
    if (!isObjectObject(o)) {
        return false;
    }
    // If has modified constructor
    const ctor = o.constructor;
    if (typeof ctor !== 'function') {
        return false;
    }
    // If has modified prototype
    const prot = ctor.prototype;
    if (!isObjectObject(prot)) {
        return false;
    }
    // If constructor does not have an Object-specific method
    if (!prot.hasOwnProperty('isPrototypeOf')) {
        return false;
    }
    // Most likely a plain Object
    return true;
}
exports.isPlainObject = isPlainObject;
