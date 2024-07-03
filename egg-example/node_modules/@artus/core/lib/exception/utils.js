"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchExceptionFilter = exports.matchExceptionFilterClazz = void 0;
const constant_1 = require("./constant");
const impl_1 = require("./impl");
const matchExceptionFilterClazz = (err, container) => {
    const filterMap = container.get(constant_1.EXCEPTION_FILTER_MAP_INJECT_ID, {
        noThrow: true,
    });
    if (!filterMap) {
        return null;
    }
    let targetFilterClazz = null;
    if (err instanceof impl_1.ArtusStdError && filterMap.has(err.code)) {
        // handle ArtusStdError with code simply
        targetFilterClazz = filterMap.get(err.code);
    }
    else if (filterMap.has(err['constructor'])) {
        // handle CustomErrorClazz
        targetFilterClazz = filterMap.get(err['constructor']);
    }
    else if (filterMap.has(constant_1.EXCEPTION_FILTER_DEFAULT_SYMBOL)) {
        // handle default ExceptionFilter
        targetFilterClazz = filterMap.get(constant_1.EXCEPTION_FILTER_DEFAULT_SYMBOL);
    }
    return targetFilterClazz;
};
exports.matchExceptionFilterClazz = matchExceptionFilterClazz;
const matchExceptionFilter = (err, container) => {
    const filterClazz = (0, exports.matchExceptionFilterClazz)(err, container);
    // return the instance of exception filter
    return filterClazz ? container.get(filterClazz) : null;
};
exports.matchExceptionFilter = matchExceptionFilter;
