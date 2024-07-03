"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorator_1 = require("../decorator");
const module_1 = tslib_1.__importDefault(require("./module"));
const exception_1 = require("../../exception");
let ExceptionFilterLoader = class ExceptionFilterLoader extends module_1.default {
    async load(item) {
        // Get or Init Exception Filter Map
        let filterMap = this.container.get(exception_1.EXCEPTION_FILTER_MAP_INJECT_ID, {
            noThrow: true,
        });
        if (!filterMap) {
            filterMap = new Map();
            this.container.set({
                id: exception_1.EXCEPTION_FILTER_MAP_INJECT_ID,
                value: filterMap,
            });
        }
        const clazzList = await super.load(item);
        for (let i = 0; i < clazzList.length; i++) {
            const filterClazz = clazzList[i];
            const filterMeta = Reflect.getOwnMetadata(exception_1.EXCEPTION_FILTER_METADATA_KEY, filterClazz);
            if (!filterMeta) {
                throw new Error(`invalid ExceptionFilter ${filterClazz.name}`);
            }
            let { targetErr } = filterMeta;
            if (filterMap.has(targetErr)) {
                // check duplicated
                if (targetErr === exception_1.EXCEPTION_FILTER_DEFAULT_SYMBOL) {
                    throw new Error('the Default ExceptionFilter is duplicated');
                }
                let targetErrName = targetErr;
                if (typeof targetErr !== 'string' && typeof targetErr !== 'symbol') {
                    targetErrName = targetErr.name || targetErr;
                }
                throw new Error(`the ExceptionFilter for ${String(targetErrName)} is duplicated`);
            }
            if (typeof targetErr !== 'string' && typeof targetErr !== 'symbol' && // Decorate with a error class
                Object.prototype.isPrototypeOf.call(exception_1.ArtusStdError.prototype, targetErr.prototype) && // the class extends ArtusStdError
                typeof targetErr['code'] === 'string' // Have static property `code` defined by string
            ) {
                // Custom Exception Class use Error Code for simplied match
                targetErr = targetErr['code'];
            }
            filterMap.set(targetErr, filterClazz);
        }
        return clazzList;
    }
};
ExceptionFilterLoader = tslib_1.__decorate([
    (0, decorator_1.DefineLoader)('exception-filter')
], ExceptionFilterLoader);
exports.default = ExceptionFilterLoader;
