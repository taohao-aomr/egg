"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const injection_1 = require("@artus/injection");
const constant_1 = require("../constant");
const level_1 = require("./level");
let Logger = class Logger {
    get loggerOpts() {
        var _a;
        let appConfig = {};
        try {
            appConfig = this.container.get(constant_1.ArtusInjectEnum.Config);
        }
        catch (e) {
            // do nothing
        }
        return (_a = appConfig === null || appConfig === void 0 ? void 0 : appConfig.logger) !== null && _a !== void 0 ? _a : {};
    }
    checkLoggerLevel(level) {
        var _a;
        const targetLevel = (_a = this.loggerOpts.level) !== null && _a !== void 0 ? _a : level_1.LoggerLevel.INFO;
        if (level_1.LOGGER_LEVEL_MAP[level] < level_1.LOGGER_LEVEL_MAP[targetLevel]) {
            return false;
        }
        return true;
    }
    trace(message, ...args) {
        if (!this.checkLoggerLevel(level_1.LoggerLevel.TRACE)) {
            return;
        }
        console.trace(message, ...args);
    }
    debug(message, ...args) {
        if (!this.checkLoggerLevel(level_1.LoggerLevel.DEBUG)) {
            return;
        }
        console.debug(message, ...args);
    }
    info(message, ...args) {
        if (!this.checkLoggerLevel(level_1.LoggerLevel.INFO)) {
            return;
        }
        console.info(message, ...args);
    }
    warn(message, ...args) {
        if (!this.checkLoggerLevel(level_1.LoggerLevel.WARN)) {
            return;
        }
        console.warn(message, ...args);
    }
    error(message, ...args) {
        if (!this.checkLoggerLevel(level_1.LoggerLevel.ERROR)) {
            return;
        }
        console.error(message, ...args);
    }
    fatal(message, ...args) {
        if (!this.checkLoggerLevel(level_1.LoggerLevel.FATAL)) {
            return;
        }
        console.error(message, ...args);
    }
    log({ level, message, splat = [], }) {
        var _a;
        if (message instanceof Error) {
            if (level === level_1.LoggerLevel.ERROR) {
                return this.error(message, ...splat);
            }
            message = (_a = message.stack) !== null && _a !== void 0 ? _a : message.message;
        }
        switch (level) {
            case level_1.LoggerLevel.TRACE:
                this.trace(message, ...splat);
                break;
            case level_1.LoggerLevel.DEBUG:
                this.debug(message, ...splat);
                break;
            case level_1.LoggerLevel.INFO:
                this.info(message, ...splat);
                break;
            case level_1.LoggerLevel.WARN:
                this.warn(message, ...splat);
                break;
            case level_1.LoggerLevel.ERROR:
                this.error(message, ...splat);
                break;
            case level_1.LoggerLevel.FATAL:
                this.fatal(message, ...splat);
                break;
        }
    }
};
tslib_1.__decorate([
    (0, injection_1.Inject)(),
    tslib_1.__metadata("design:type", injection_1.Container)
], Logger.prototype, "container", void 0);
Logger = tslib_1.__decorate([
    (0, injection_1.Injectable)({
        scope: injection_1.ScopeEnum.SINGLETON,
    })
], Logger);
exports.default = Logger;
