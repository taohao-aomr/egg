"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = exports.ArtusCliError = exports.ErrorCode = void 0;
const node_util_1 = require("node:util");
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["UNKNOWN_OPTIONS"] = "UNKNOWN_OPTIONS";
    ErrorCode["REQUIRED_OPTIONS"] = "REQUIRED_OPTIONS";
    ErrorCode["NOT_ENOUGH_ARGUMENTS"] = "NOT_ENOUGH_ARGUMENTS";
    ErrorCode["COMMAND_IS_NOT_FOUND"] = "COMMAND_IS_NOT_FOUND";
    ErrorCode["COMMAND_IS_NOT_IMPLEMENT"] = "COMMAND_IS_NOT_IMPLEMENT";
    ErrorCode["COMMAND_IS_CONFLICT"] = "COMMAND_IS_CONFLICT";
    ErrorCode["UNKNOWN"] = "UNKNOWN";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
class ArtusCliError extends Error {
    static create(code, message, ...args) {
        const err = new ArtusCliError((0, node_util_1.format)(message, ...args));
        err.code = code;
        return err;
    }
}
exports.ArtusCliError = ArtusCliError;
const c = ArtusCliError.create;
exports.errors = {
    unknown_options(options) {
        return c(ErrorCode.UNKNOWN_OPTIONS, 'Unknown options: %s', options.join(', '));
    },
    required_options(options) {
        return c(ErrorCode.REQUIRED_OPTIONS, 'Required options: %s', options.join(', '));
    },
    not_enough_argumnents(requiredArgv) {
        return c(ErrorCode.NOT_ENOUGH_ARGUMENTS, 'Not enough arguments, %s is required', requiredArgv.join(', '));
    },
    command_is_not_found(commandInfo) {
        return c(ErrorCode.COMMAND_IS_NOT_FOUND, 'Command is not found: \'%s\'', commandInfo);
    },
    command_is_not_implement(commandInfo) {
        return c(ErrorCode.COMMAND_IS_NOT_IMPLEMENT, 'Command is not implement: \'%s\'', commandInfo);
    },
    command_is_conflict(command, existsCommandName, existsCommandLocation, conflictCommandName, conflictCommandLocation) {
        return c(ErrorCode.COMMAND_IS_CONFLICT, 'Command \'%s\' is conflict in %s(%s) and %s(%s)', command, existsCommandName, existsCommandLocation || '-', conflictCommandName, conflictCommandLocation || '-');
    },
    unknown(message) {
        return c(ErrorCode.UNKNOWN, message);
    },
};
