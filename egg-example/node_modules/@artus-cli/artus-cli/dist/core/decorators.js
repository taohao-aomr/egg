"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = exports.Option = exports.Options = exports.DefineCommand = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@artus/core");
const constant_1 = require("../constant");
const parsed_commands_1 = require("../core/parsed_commands");
const context_1 = require("./context");
const koa_compose_1 = tslib_1.__importDefault(require("koa-compose"));
const utils_1 = require("../utils");
function DefineCommand(opt, option) {
    return (target) => {
        const calleeList = (0, utils_1.getCalleeList)(15);
        const tslibLocation = calleeList.findIndex(({ methodName, fileName }) => methodName === '__decorate' && fileName.includes('tslib'));
        const commandLocation = tslibLocation < 0 ? null : calleeList[tslibLocation + 1];
        Reflect.defineMetadata(constant_1.MetadataEnum.COMMAND, {
            config: opt || {},
            location: commandLocation === null || commandLocation === void 0 ? void 0 : commandLocation.fileName,
            overrideCommand: option === null || option === void 0 ? void 0 : option.overrideCommand,
            inheritMetadata: option === null || option === void 0 ? void 0 : option.inheritMetadata,
        }, target);
        (0, core_1.addTag)(constant_1.MetadataEnum.COMMAND, target);
        (0, core_1.Injectable)({ scope: core_1.ScopeEnum.EXECUTION })(target);
        // inject ctx to proto
        (0, core_1.Inject)(context_1.CommandContext)(target, constant_1.CONTEXT_SYMBOL);
        wrapWithMiddleware(target);
        return target;
    };
}
exports.DefineCommand = DefineCommand;
function Options(meta) {
    return (target, key) => {
        const result = initOptionMeta(target);
        Object.assign(result.config, meta);
        result.injections.push({
            propName: key,
            type: constant_1.OptionInjectType.FULL_OPTION,
        });
    };
}
exports.Options = Options;
function Option(descOrOpt) {
    return (target, key) => {
        const result = initOptionMeta(target);
        const config = typeof descOrOpt === 'string'
            ? { description: descOrOpt }
            : (descOrOpt || {});
        const designType = Reflect.getOwnMetadata('design:type', target, key);
        if (designType === String) {
            config.type = 'string';
        }
        else if (designType === Number) {
            config.type = 'number';
        }
        else if (designType === Boolean) {
            config.type = 'boolean';
        }
        else if (designType === Array) {
            config.array = true;
        }
        // merge with exists config
        result.config[key] = Object.assign(Object.assign({}, result.config[key]), config);
        result.injections.push({
            propName: key,
            type: constant_1.OptionInjectType.KEY_OPTION,
        });
    };
}
exports.Option = Option;
function Middleware(fn, option) {
    return (target, key) => {
        if (key && key !== 'run')
            throw new Error('Middleware can only be used in Command Class or run method');
        const ctor = key ? target.constructor : target;
        const metaKey = key ? constant_1.MetadataEnum.RUN_MIDDLEWARE : constant_1.MetadataEnum.MIDDLEWARE;
        const existsMeta = Reflect.getOwnMetadata(metaKey, ctor) || ({ configList: [] });
        // add config in meta data
        existsMeta.configList.push({
            middleware: fn,
            mergeType: (option === null || option === void 0 ? void 0 : option.mergeType) || 'after',
        });
        Reflect.defineMetadata(metaKey, existsMeta, ctor);
    };
}
exports.Middleware = Middleware;
function initOptionMeta(target) {
    const ctor = target.constructor;
    if (!Reflect.hasOwnMetadata(constant_1.MetadataEnum.OPTION, ctor)) {
        const optionMeta = {
            config: {},
            injections: [],
        };
        Reflect.defineMetadata(constant_1.MetadataEnum.OPTION, optionMeta, ctor);
    }
    return Reflect.getOwnMetadata(constant_1.MetadataEnum.OPTION, ctor);
}
/**
 * wrap middleware logic in command class
 */
function wrapWithMiddleware(clz) {
    const runMethod = clz.prototype.run;
    Object.defineProperty(clz.prototype, 'run', {
        async value(...args) {
            const ctx = this[constant_1.CONTEXT_SYMBOL];
            const parsedCommand = ctx.container.get(parsed_commands_1.ParsedCommands).getCommand(clz);
            // compose with middlewares in run method
            return (0, koa_compose_1.default)([
                ...(parsedCommand === null || parsedCommand === void 0 ? void 0 : parsedCommand.executionMiddlewares) || [],
                async (ctx) => {
                    const result = await runMethod.apply(this, args);
                    ctx.output.data = { result };
                    return result;
                },
            ])(ctx);
        },
    });
    // add execution method
    Object.defineProperty(clz.prototype, constant_1.EXCUTION_SYMBOL, {
        async value(...args) {
            const ctx = this[constant_1.CONTEXT_SYMBOL];
            const parsedCommand = ctx.container.get(parsed_commands_1.ParsedCommands).getCommand(clz);
            // compose with middlewares in Command Class
            return (0, koa_compose_1.default)([
                ...(parsedCommand === null || parsedCommand === void 0 ? void 0 : parsedCommand.commandMiddlewares) || [],
                async () => this.run(...args),
            ])(ctx);
        },
    });
}
