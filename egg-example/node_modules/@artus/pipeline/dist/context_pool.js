"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextPool = void 0;
const reusify_1 = require("./reusify");
const base_1 = require("./base");
class ContextPool {
    constructor(max, ctxFactory) {
        this.contextFactory = ctxFactory !== null && ctxFactory !== void 0 ? ctxFactory : (() => {
            return new base_1.Context();
        });
        this.pool = new reusify_1.Reusify({ max: max || 100, factory: this.contextFactory });
    }
    get(container, input, output) {
        const ctx = this.pool.get();
        ctx.container = container;
        ctx.input = input !== null && input !== void 0 ? input : ctx.input;
        ctx.output = output !== null && output !== void 0 ? output : ctx.output;
        return ctx;
    }
    release(ctx) {
        var _a;
        (_a = ctx.restore) === null || _a === void 0 ? void 0 : _a.call(ctx);
        this.pool.release(ctx);
    }
}
exports.ContextPool = ContextPool;
//# sourceMappingURL=context_pool.js.map