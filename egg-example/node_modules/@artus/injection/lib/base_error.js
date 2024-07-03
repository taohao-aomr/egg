"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorClass = void 0;
function createErrorClass(name) {
    const Clz = class extends Error {
        constructor(message) {
            super();
            Object.defineProperty(this, 'message', {
                get: typeof message === 'function' ?
                    message :
                    () => message,
            });
        }
        get message() {
            return 'To be override.';
        }
        get name() {
            return name;
        }
    };
    return Clz;
}
exports.createErrorClass = createErrorClass;
//# sourceMappingURL=base_error.js.map