"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtusStdError = exports.exceptionFilterMiddleware = void 0;
const constant_1 = require("../constant");
const utils_1 = require("./utils");
const exceptionFilterMiddleware = async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        const filter = (0, utils_1.matchExceptionFilter)(err, ctx.container);
        if (filter) {
            await filter.catch(err);
        }
        throw err;
    }
};
exports.exceptionFilterMiddleware = exceptionFilterMiddleware;
class ArtusStdError extends Error {
    static registerCode(code, item) {
        this.codeMap.set(code, item);
    }
    static setCurrentLocale(locale) {
        this.currentLocale = locale;
    }
    constructor(code) {
        super(`[${code}] This is Artus standard error, Please check on https://github.com/artusjs/spec/blob/master/documentation/core/6.exception.md`); // default message
        this.name = 'ArtusStdError';
        this._code = code;
        this.message = this.getFormatedMessage();
    }
    getFormatedMessage() {
        const { code, desc, detailUrl } = this;
        return `[${code}] ${desc}${detailUrl ? ', Please check on ' + detailUrl : ''}`;
    }
    get code() {
        return this._code;
    }
    get desc() {
        const { codeMap, currentLocale } = ArtusStdError;
        const exceptionItem = codeMap.get(this._code);
        if (!exceptionItem) {
            return 'Unknown Error';
        }
        if (typeof exceptionItem.desc === 'string') {
            return exceptionItem.desc;
        }
        return exceptionItem.desc[currentLocale];
    }
    get detailUrl() {
        var _a;
        return (_a = ArtusStdError.codeMap.get(this._code)) === null || _a === void 0 ? void 0 : _a.detailUrl;
    }
}
exports.ArtusStdError = ArtusStdError;
ArtusStdError.codeMap = new Map();
ArtusStdError.currentLocale = process.env.ARTUS_ERROR_LOCALE || constant_1.ARTUS_EXCEPTION_DEFAULT_LOCALE;
