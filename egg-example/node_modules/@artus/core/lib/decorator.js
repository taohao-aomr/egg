"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleHook = exports.LifecycleHookUnit = void 0;
const tslib_1 = require("tslib");
const injection_1 = require("@artus/injection");
const constant_1 = require("./constant");
function LifecycleHookUnit() {
    return (target) => {
        Reflect.defineMetadata(constant_1.HOOK_FILE_LOADER, { loader: 'lifecycle-hook-unit' }, target);
        (0, injection_1.Injectable)({ lazy: true })(target);
    };
}
exports.LifecycleHookUnit = LifecycleHookUnit;
function LifecycleHook(hookName) {
    return (target, propertyKey) => {
        if (typeof propertyKey === 'symbol') {
            throw new Error(`hookName is not support symbol [${propertyKey.description}]`);
        }
        Reflect.defineMetadata(`${constant_1.HOOK_NAME_META_PREFIX}${propertyKey}`, hookName !== null && hookName !== void 0 ? hookName : propertyKey, target.constructor);
    };
}
exports.LifecycleHook = LifecycleHook;
tslib_1.__exportStar(require("./loader/decorator"), exports);
