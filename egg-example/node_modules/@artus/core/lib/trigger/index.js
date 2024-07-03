"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const injection_1 = require("@artus/injection");
const pipeline_1 = require("@artus/pipeline");
const constant_1 = require("../constant");
const exception_1 = require("../exception");
let Trigger = class Trigger {
    constructor() {
        this.pipeline = new pipeline_1.Pipeline();
        this.pipeline.use(exception_1.exceptionFilterMiddleware);
    }
    async use(middleware) {
        // TODO: async hook before pipeline.use(middleware)
        this.pipeline.use(middleware);
    }
    async initContext(input = new pipeline_1.Input(), output = new pipeline_1.Output()) {
        const ctx = new pipeline_1.Context(input, output);
        ctx.container = new injection_1.ExecutionContainer(ctx, this.app.container);
        ctx.container.set({
            id: injection_1.ExecutionContainer,
            value: ctx.container,
        });
        return ctx;
    }
    async startPipeline(ctx) {
        await this.pipeline.run(ctx);
    }
};
tslib_1.__decorate([
    (0, injection_1.Inject)(constant_1.ArtusInjectEnum.Application),
    tslib_1.__metadata("design:type", Object)
], Trigger.prototype, "app", void 0);
Trigger = tslib_1.__decorate([
    (0, injection_1.Injectable)({ scope: injection_1.ScopeEnum.SINGLETON }),
    tslib_1.__metadata("design:paramtypes", [])
], Trigger);
exports.default = Trigger;
