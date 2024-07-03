"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedCommandTree = void 0;
const tslib_1 = require("tslib");
const node_util_1 = require("node:util");
const node_assert_1 = tslib_1.__importDefault(require("node:assert"));
const core_1 = require("@artus/core");
const parser_1 = require("./parser");
const command_1 = require("./command");
const constant_1 = require("../constant");
const utils_1 = require("../utils");
const errors_1 = require("../errors");
const parsed_command_1 = require("./parsed_command");
const bin_info_1 = require("./bin_info");
const debug = (0, node_util_1.debuglog)('artus-cli#ParsedCommands');
/** Parsed Command Tree */
let ParsedCommandTree = class ParsedCommandTree {
    constructor() {
        /** command list, the key is command string used to match argv */
        this.commands = new Map();
        /** cache the instance of parsedCommand */
        this.parsedCommandMap = new Map();
    }
    get descObj() {
        return Object.assign(Object.assign({}, this.binInfo), { $0: this.binInfo.binName, bin: this.binInfo.binName });
    }
    resolveOptions(clz, argumentsKey) {
        const optionMeta = Reflect.getOwnMetadata(constant_1.MetadataEnum.OPTION, clz);
        const option = (optionMeta === null || optionMeta === void 0 ? void 0 : optionMeta.config) || {};
        const descObj = this.descObj;
        const flagOptions = {};
        const argumentOptions = {};
        Object.keys(option).forEach(key => {
            const obj = argumentsKey.includes(key) ? argumentOptions : flagOptions;
            const config = obj[key] = Object.assign({}, option[key]);
            if (config.description) {
                config.description = (0, utils_1.formatDesc)(config.description, descObj);
            }
        });
        const injections = (optionMeta === null || optionMeta === void 0 ? void 0 : optionMeta.injections) || [];
        injections.push(
        // default option in args
        { propName: '_', type: constant_1.OptionInjectType.KEY_OPTION }, { propName: '--', type: constant_1.OptionInjectType.KEY_OPTION });
        return Object.assign(Object.assign({}, optionMeta), { injections,
            flagOptions,
            argumentOptions });
    }
    formatCommandConfig(config, parent) {
        const binName = this.binInfo.binName;
        const descObj = this.descObj;
        const prefix = parent === null || parent === void 0 ? void 0 : parent.cmds.join(' ');
        const command = (0, utils_1.formatCmd)(config.command || '', descObj, prefix);
        const examples = (0, utils_1.formatToArray)(config.examples).map(info => {
            const items = typeof info === 'string' ? [info] : info;
            return {
                command: (0, utils_1.formatCmd)(items[0], descObj, prefix),
                description: items[1] ? (0, utils_1.formatDesc)(items[1], descObj) : undefined,
            };
        });
        const parsedCommandInfo = (0, parser_1.parseCommand)(command, binName);
        return {
            command,
            enable: typeof config.enable === 'boolean' ? config.enable : true,
            examples,
            alias: (0, utils_1.formatToArray)(config.alias),
            description: (0, utils_1.formatDesc)(config.description || '', descObj),
            originalCommandConfig: config,
            parsedCommandInfo,
        };
    }
    /** convert Command class to ParsedCommand instance */
    initParsedCommand(clz) {
        var _a;
        const metadata = Reflect.getOwnMetadata(constant_1.MetadataEnum.COMMAND, clz);
        if (!metadata)
            return;
        // avoid creating parsedCommand again.
        if (this.parsedCommandMap.has(clz)) {
            return this.parsedCommandMap.get(clz);
        }
        const commandMeta = metadata;
        const inheritClass = Object.getPrototypeOf(clz);
        const inheritCommand = this.initParsedCommand(inheritClass);
        const shouldInheritMetadata = typeof commandMeta.inheritMetadata === 'boolean'
            ? commandMeta.inheritMetadata
            : this.binInfo.inheritMetadata;
        let commandConfig = Object.assign({}, commandMeta.config);
        // mege command config with inherit command
        if (inheritCommand && shouldInheritMetadata) {
            const inheritCommandConfig = inheritCommand.commandConfig;
            commandConfig = Object.assign({}, {
                alias: inheritCommandConfig.alias,
                command: inheritCommandConfig.command,
                description: inheritCommandConfig.description,
                examples: inheritCommandConfig.examples,
                parent: inheritCommandConfig.parent,
            }, commandConfig);
        }
        // init parent
        let parentCommand;
        if (commandConfig.parent) {
            parentCommand = this.initParsedCommand(commandConfig.parent);
            (0, node_assert_1.default)(parentCommand, `parent ${(_a = commandConfig.parent) === null || _a === void 0 ? void 0 : _a.name} is not a valid Command`);
        }
        // format command config
        const formattedCommandConfig = this.formatCommandConfig(commandConfig, parentCommand);
        const parsedCommandInfo = formattedCommandConfig.parsedCommandInfo;
        // split options with argument key and merge option info with inherit command
        const argumentsKey = parsedCommandInfo.demanded.concat(parsedCommandInfo.optional).map(pos => pos.cmd);
        const optionConfig = this.resolveOptions(clz, argumentsKey);
        if (inheritCommand && shouldInheritMetadata) {
            optionConfig.injections = inheritCommand.injections.concat(optionConfig.injections || []);
            optionConfig.flagOptions = Object.assign({}, inheritCommand.flagOptions, optionConfig.flagOptions);
            optionConfig.argumentOptions = Object.assign({}, inheritCommand.argumentOptions, optionConfig.argumentOptions);
        }
        const parsedCommand = new parsed_command_1.ParsedCommand(clz, {
            location: commandMeta.location,
            commandConfig: formattedCommandConfig,
            optionConfig,
        });
        if (inheritCommand)
            parsedCommand.inherit = inheritCommand;
        if (this.commands.has(parsedCommandInfo.uid)) {
            const existsParsedCommand = this.commands.get(parsedCommandInfo.uid);
            // override only allow in class inheritance or options.override=true
            const err = errors_1.errors.command_is_conflict(existsParsedCommand.command, existsParsedCommand.clz.name, existsParsedCommand.location, parsedCommand.clz.name, parsedCommand.location);
            if (!commandMeta.overrideCommand && !(0, utils_1.isInheritFrom)(parsedCommand.clz, existsParsedCommand.clz)) {
                throw err;
            }
            debug(err.message);
        }
        // handle middlewares
        // Default orders:
        //
        // In class inheritance:
        //              command1  <-extend-  command2
        // trigger --> middleware1   -->   middleware2 --> middleware3  --> run
        //
        // ------------
        //
        // In run method:
        //                      command2                               command1
        // trigger --> middleware2 --> middleware3 --> run --> middleware1 --> super.run
        // merge command middlewares with inherit command
        const middlewareMeta = Reflect.getOwnMetadata(constant_1.MetadataEnum.MIDDLEWARE, clz);
        const commandMiddlewareConfigList = (middlewareMeta === null || middlewareMeta === void 0 ? void 0 : middlewareMeta.configList) || [];
        if (inheritCommand && shouldInheritMetadata) {
            parsedCommand.addMiddlewares('command', { middleware: inheritCommand.commandMiddlewares });
        }
        commandMiddlewareConfigList.forEach(config => parsedCommand.addMiddlewares('command', config));
        // add run middlewares, no need to merge with inherit command
        const executionMiddlewareConfig = Reflect.getOwnMetadata(constant_1.MetadataEnum.RUN_MIDDLEWARE, clz);
        const executionMiddlewareConfigList = (executionMiddlewareConfig === null || executionMiddlewareConfig === void 0 ? void 0 : executionMiddlewareConfig.configList) || [];
        executionMiddlewareConfigList.forEach(config => parsedCommand.addMiddlewares('execution', config));
        // cache the instance
        this.commands.set(parsedCommandInfo.uid, parsedCommand);
        this.parsedCommandMap.set(clz, parsedCommand);
        return parsedCommand;
    }
    build(commandList) {
        this.root = undefined;
        this.commands.clear();
        this.parsedCommandMap.clear();
        const parsedCommands = commandList
            .map(clz => this.initParsedCommand(clz))
            .filter(c => !!c);
        // handle parent and childs
        parsedCommands
            .sort((a, b) => a.depth - b.depth)
            .forEach(parsedCommand => {
            let parent;
            parsedCommand.cmds.forEach(cmd => {
                // fullCmd is the key of this.commands
                const fullCmd = parent ? parent.cmds.concat(cmd).join(' ') : cmd;
                let cacheParsedCommand = this.commands.get(fullCmd);
                if (!cacheParsedCommand) {
                    // create empty node
                    debug('Create empty command for \'%s\'', fullCmd);
                    cacheParsedCommand = new parsed_command_1.ParsedCommand(command_1.EmptyCommand, {
                        commandConfig: this.formatCommandConfig({ command: fullCmd }),
                    });
                    this.commands.set(fullCmd, cacheParsedCommand);
                }
                if (!parent) {
                    this.root = parent = cacheParsedCommand;
                    return;
                }
                cacheParsedCommand.parent = parent;
                parent.childs.push(cacheParsedCommand);
                parent = cacheParsedCommand;
            });
        });
    }
    get(clz) {
        return this.parsedCommandMap.get(clz);
    }
};
tslib_1.__decorate([
    (0, core_1.Inject)(),
    tslib_1.__metadata("design:type", bin_info_1.BinInfo)
], ParsedCommandTree.prototype, "binInfo", void 0);
ParsedCommandTree = tslib_1.__decorate([
    (0, core_1.Injectable)({ scope: core_1.ScopeEnum.SINGLETON })
], ParsedCommandTree);
exports.ParsedCommandTree = ParsedCommandTree;
