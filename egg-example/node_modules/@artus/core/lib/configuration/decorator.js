"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefineConfigHandle = void 0;
const constant_1 = require("../constant");
function DefineConfigHandle(handleName) {
    return (target, propertyKey) => {
        if (typeof propertyKey === 'symbol') {
            throw new Error(`hookName is not support symbol [${propertyKey.description}]`);
        }
        Reflect.defineMetadata(`${constant_1.HOOK_CONFIG_HANDLE}${handleName}`, propertyKey, target.constructor);
    };
}
exports.DefineConfigHandle = DefineConfigHandle;
