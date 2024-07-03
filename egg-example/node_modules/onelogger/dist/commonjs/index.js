"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoreLogger = exports.getLogger = exports.getCustomLogger = exports.setCoreLogger = exports.setLogger = exports.setCustomLogger = void 0;
const Logger_js_1 = require("./Logger.js");
__exportStar(require("./Logger.js"), exports);
function setCustomLogger(loggerName, realLogger) {
    Logger_js_1.Logger.setRealLogger(loggerName, realLogger);
}
exports.setCustomLogger = setCustomLogger;
function setLogger(realLogger) {
    setCustomLogger('logger', realLogger);
}
exports.setLogger = setLogger;
function setCoreLogger(realLogger) {
    setCustomLogger('coreLogger', realLogger);
}
exports.setCoreLogger = setCoreLogger;
const loggers = new Map();
function getCustomLogger(loggerName, prefix) {
    const key = `${loggerName}-${prefix ?? ''}`;
    let logger = loggers.get(key);
    if (!logger) {
        logger = new Logger_js_1.Logger({ loggerName, prefix });
        loggers.set(key, logger);
    }
    return logger;
}
exports.getCustomLogger = getCustomLogger;
function getLogger(prefix) {
    return getCustomLogger('logger', prefix);
}
exports.getLogger = getLogger;
function getCoreLogger(prefix) {
    return getCustomLogger('coreLogger', prefix);
}
exports.getCoreLogger = getCoreLogger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBcUM7QUFJckMsOENBQTRCO0FBRTVCLFNBQWdCLGVBQWUsQ0FBQyxVQUFrQixFQUFFLFVBQStCO0lBQ2pGLGtCQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxDQUFDO0FBRkQsMENBRUM7QUFFRCxTQUFnQixTQUFTLENBQUMsVUFBbUI7SUFDM0MsZUFBZSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBRkQsOEJBRUM7QUFFRCxTQUFnQixhQUFhLENBQUMsVUFBbUI7SUFDL0MsZUFBZSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBRkQsc0NBRUM7QUFFRCxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztBQUUxQyxTQUFnQixlQUFlLENBQUMsVUFBa0IsRUFBRSxNQUFlO0lBQ2pFLE1BQU0sR0FBRyxHQUFHLEdBQUcsVUFBVSxJQUFJLE1BQU0sSUFBSSxFQUFFLEVBQUUsQ0FBQztJQUM1QyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNaLE1BQU0sR0FBRyxJQUFJLGtCQUFNLENBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQVJELDBDQVFDO0FBRUQsU0FBZ0IsU0FBUyxDQUFDLE1BQWU7SUFDdkMsT0FBTyxlQUFlLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzNDLENBQUM7QUFGRCw4QkFFQztBQUVELFNBQWdCLGFBQWEsQ0FBQyxNQUFlO0lBQzNDLE9BQU8sZUFBZSxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMvQyxDQUFDO0FBRkQsc0NBRUMifQ==