"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseLoader {
    async load(_item) {
        throw new Error('Not implemented');
    }
}
exports.default = BaseLoader;
