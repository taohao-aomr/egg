"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Catch = void 0;
const injection_1 = require("@artus/injection");
const constant_1 = require("../constant");
const constant_2 = require("./constant");
const Catch = (targetErr) => {
    return (target) => {
        Reflect.defineMetadata(constant_2.EXCEPTION_FILTER_METADATA_KEY, {
            targetErr: targetErr !== null && targetErr !== void 0 ? targetErr : constant_2.EXCEPTION_FILTER_DEFAULT_SYMBOL,
        }, target);
        Reflect.defineMetadata(constant_1.HOOK_FILE_LOADER, { loader: 'exception-filter' }, target);
        (0, injection_1.Injectable)()(target);
    };
};
exports.Catch = Catch;
