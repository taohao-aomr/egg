"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pipeline = void 0;
class Pipeline {
    constructor() {
        this.middlewares = [];
    }
    use(middleware) {
        if (typeof middleware === 'function') {
            this.middlewares.push(middleware);
            return;
        }
        if (Array.isArray(middleware)) {
            for (const mid of middleware) {
                this.use(mid);
            }
            return;
        }
        // eg. pipeline1.use(pipeline2)
        if (middleware.middlewares) {
            this.use(middleware.middlewares);
            return;
        }
        throw new Error(`${middleware} isn't type MiddlewareInput`);
    }
    dispatch(i, ctx, execution = { index: -1 }) {
        if (i <= execution.index)
            return Promise.reject(new Error('next() called multiple times'));
        execution.index = i;
        const fn = this.middlewares[i];
        if (!fn)
            return Promise.resolve();
        try {
            return Promise.resolve(fn(ctx, this.dispatch.bind(this, i + 1, ctx, execution)));
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    run(ctx) {
        return this.dispatch(0, ctx);
    }
}
exports.Pipeline = Pipeline;
//# sourceMappingURL=pipeline.js.map