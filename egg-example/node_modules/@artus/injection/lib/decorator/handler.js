"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectHandler = void 0;
const constant_1 = require("../constant");
const util_1 = require("../util");
function InjectHandler(handlerName, id) {
    return function (target, key, index) {
        if ((0, util_1.isObject)(target)) {
            target = target.constructor;
        }
        if (!(0, util_1.isUndefined)(index)) {
            const metadatas = ((0, util_1.getMetadata)(constant_1.INJECT_HANDLER_ARGS, target) ||
                []);
            metadatas.push({ handler: handlerName, id, index });
            (0, util_1.setMetadata)(constant_1.INJECT_HANDLER_ARGS, metadatas, target);
            return;
        }
        const metadatas = ((0, util_1.getMetadata)(constant_1.INJECT_HANDLER_PROPS, target) ||
            []);
        metadatas.push({ handler: handlerName, id, propertyName: key });
        (0, util_1.setMetadata)(constant_1.INJECT_HANDLER_PROPS, metadatas, target);
    };
}
exports.InjectHandler = InjectHandler;
//# sourceMappingURL=handler.js.map