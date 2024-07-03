"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandTrigger = void 0;
const tslib_1 = require("tslib");
const node_util_1 = require("node:util");
const core_1 = require("@artus/core");
const pipeline_1 = require("@artus/pipeline");
const constant_1 = require("../constant");
const context_1 = require("./context");
const debug = (0, node_util_1.debuglog)('artus-cli#trigger');
let CommandTrigger = class CommandTrigger extends core_1.Trigger {
    async start() {
        // core middleware
        this.use(async (ctx, next) => {
            await next();
            const { matched, error } = ctx.container.get(context_1.CommandContext);
            // match error, throw
            if (error)
                throw error;
            if (!matched || !matched.isRunable) {
                debug('Can not match any command, exit...');
                return;
            }
            // execute command
            debug('Run command %s', matched.clz.name);
            await this.executeCommand(ctx, matched);
        });
        await this.executePipeline();
    }
    async init() {
        this.use(async (ctx, next) => {
            // parse argv and match command
            ctx.init();
            await next();
        });
    }
    /** override artus context */
    async initContext(input, output) {
        const baseCtx = await super.initContext(input, output);
        const cmdCtx = baseCtx.container.get(context_1.CommandContext);
        cmdCtx.container = baseCtx.container;
        cmdCtx.container.set({ id: context_1.CommandContext, value: cmdCtx });
        cmdCtx.input = baseCtx.input;
        cmdCtx.output = baseCtx.output;
        return cmdCtx;
    }
    /** start a pipeline and execute */
    async executePipeline(input) {
        try {
            const ctx = await this.initContext({
                params: Object.assign({ 
                    // set input data
                    argv: process.argv.slice(2), env: Object.assign({}, process.env), cwd: process.cwd() }, input),
            });
            ctx.container.set({ id: pipeline_1.Context, value: ctx });
            await this.startPipeline(ctx);
        }
        catch (err) {
            console.error(err);
            process.exit(typeof err.code === 'number' ? err.code : 1);
        }
    }
    /** execute command in pipeline */
    async executeCommand(ctx, cmd) {
        const instance = ctx.container.get(cmd.clz);
        cmd.injections.forEach(info => {
            if (info.type === constant_1.OptionInjectType.FULL_OPTION) {
                instance[info.propName] = ctx.args;
            }
            else {
                const assignValue = ctx.args[info.propName];
                if (assignValue !== undefined)
                    instance[info.propName] = assignValue;
            }
        });
        if (instance[constant_1.EXCUTION_SYMBOL])
            await instance[constant_1.EXCUTION_SYMBOL]();
        return ctx.output.data;
    }
};
CommandTrigger = tslib_1.__decorate([
    (0, core_1.Injectable)({ scope: core_1.ScopeEnum.SINGLETON })
], CommandTrigger);
exports.CommandTrigger = CommandTrigger;
