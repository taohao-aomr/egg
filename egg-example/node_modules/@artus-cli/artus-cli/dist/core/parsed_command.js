"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedCommand = void 0;
const command_1 = require("./command");
const OPTION_SYMBOL = Symbol('ParsedCommand#Option');
/** Wrapper of command */
class ParsedCommand {
    constructor(clz, option) {
        this.clz = clz;
        const { location, commandConfig, optionConfig } = option;
        const { parsedCommandInfo } = commandConfig;
        this.location = location;
        // read from parsed_command
        this.uid = parsedCommandInfo.uid;
        this.command = parsedCommandInfo.command;
        this.cmd = parsedCommandInfo.cmd;
        this.cmds = parsedCommandInfo.cmds;
        this.demanded = parsedCommandInfo.demanded;
        this.optional = parsedCommandInfo.optional;
        // read from option config
        this.injections = (optionConfig === null || optionConfig === void 0 ? void 0 : optionConfig.injections) || [];
        this.flagOptions = (optionConfig === null || optionConfig === void 0 ? void 0 : optionConfig.flagOptions) || {};
        this.argumentOptions = (optionConfig === null || optionConfig === void 0 ? void 0 : optionConfig.argumentOptions) || {};
        this.childs = [];
        this.parent = null;
        this.inherit = null;
        // read from command config
        this.commandConfig = commandConfig.originalCommandConfig;
        this.description = commandConfig.description;
        this.examples = commandConfig.examples;
        this.enable = commandConfig.enable;
        this.alias = commandConfig.alias;
        // middleware config
        this.commandMiddlewares = [];
        this.executionMiddlewares = [];
    }
    get options() {
        if (!this[OPTION_SYMBOL]) {
            this[OPTION_SYMBOL] = Object.assign(Object.assign({}, this.globalOptions), this.flagOptions);
        }
        return this[OPTION_SYMBOL];
    }
    get isRoot() {
        return !this.parent;
    }
    get isRunable() {
        return this.clz !== command_1.EmptyCommand && this.enable;
    }
    get depth() {
        return this.cmds.length;
    }
    addMiddlewares(type, config) {
        const { middleware, mergeType } = config;
        const middlewares = type === 'command' ? this.commandMiddlewares : this.executionMiddlewares;
        const extraMiddlewares = Array.isArray(middleware) ? middleware : [middleware];
        // mergeType default is after
        if (!mergeType || mergeType === 'after') {
            middlewares.push(...extraMiddlewares);
        }
        else {
            middlewares.unshift(...extraMiddlewares);
        }
    }
    updateGlobalOptions(opt) {
        this.globalOptions = Object.assign(Object.assign({}, this.globalOptions), opt);
        this[OPTION_SYMBOL] = null;
    }
}
exports.ParsedCommand = ParsedCommand;
