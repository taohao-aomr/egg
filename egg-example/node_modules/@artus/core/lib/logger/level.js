"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOGGER_LEVEL_MAP = exports.LoggerLevel = void 0;
var LoggerLevel;
(function (LoggerLevel) {
    LoggerLevel["TRACE"] = "trace";
    LoggerLevel["DEBUG"] = "debug";
    LoggerLevel["INFO"] = "info";
    LoggerLevel["WARN"] = "warn";
    LoggerLevel["ERROR"] = "error";
    LoggerLevel["FATAL"] = "fatal";
})(LoggerLevel = exports.LoggerLevel || (exports.LoggerLevel = {}));
exports.LOGGER_LEVEL_MAP = {
    [LoggerLevel.TRACE]: 0,
    [LoggerLevel.DEBUG]: 1,
    [LoggerLevel.INFO]: 2,
    [LoggerLevel.WARN]: 3,
    [LoggerLevel.ERROR]: 4,
    [LoggerLevel.FATAL]: 5,
};
