"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedCommands = void 0;
const tslib_1 = require("tslib");
const node_util_1 = require("node:util");
const core_1 = require("@artus/core");
const parser_1 = require("./parser");
const constant_1 = require("../constant");
const bin_info_1 = require("./bin_info");
const errors_1 = require("../errors");
const parsed_command_tree_1 = require("./parsed_command_tree");
const TREE_SYMBOL = Symbol('ParsedCommand#Tree');
const debug = (0, node_util_1.debuglog)('artus-cli#ParsedCommands');
let ParsedCommands = class ParsedCommands {
    // parse command tree lazily
    get tree() {
        if (!this[TREE_SYMBOL]) {
            const commandList = this.container.getInjectableByTag(constant_1.MetadataEnum.COMMAND);
            const tree = this.container.get(parsed_command_tree_1.ParsedCommandTree);
            tree.build(commandList);
            this[TREE_SYMBOL] = tree;
        }
        return this[TREE_SYMBOL];
    }
    get root() {
        return this.tree.root;
    }
    get commands() {
        return this.tree.commands;
    }
    /** match command by argv */
    _matchCommand(argv) {
        const result = {
            fuzzyMatched: this.root,
            args: this.parseArgs(argv).args,
            // parsed positional result;
            positionalArgs: {},
        };
        // argv without options/demanded/optional info
        const wholeArgv = result.args._;
        debug('Start fuzzy match with %s', wholeArgv);
        // 1. try to match command without checking demanded and optional.
        let index = 0;
        for (; index < wholeArgv.length; index++) {
            const el = wholeArgv[index];
            const nextMatch = result.fuzzyMatched.childs.find(c => (c.enable && (c.cmd === el || c.alias.includes(el))));
            if (nextMatch) {
                result.fuzzyMatched = nextMatch;
                continue;
            }
            break;
        }
        debug('Fuzzy match result is %s', result.fuzzyMatched.clz.name);
        // 2. match demanded( <options> or <options...> ) and optional( [options] or [options...] ) info
        let extraArgs = wholeArgv.slice(index);
        const fuzzyMatched = result.fuzzyMatched;
        if (fuzzyMatched.demanded.length) {
            const parsedDemanded = (0, parser_1.parseArgvWithPositional)(extraArgs, fuzzyMatched.demanded, fuzzyMatched.argumentOptions);
            if (parsedDemanded.unmatchPositionals.length && this.binInfo.strictOptions) {
                // demanded not match
                debug('Demaned positional is not match with extra argv %s', extraArgs);
                result.error = errors_1.errors.not_enough_argumnents(parsedDemanded.unmatchPositionals.map(p => p.cmd));
                return result;
            }
            // pick args from demanded info
            Object.assign(result.positionalArgs, parsedDemanded.result);
            extraArgs = parsedDemanded.unknownArgv;
        }
        if (fuzzyMatched.optional.length) {
            const parsedOptional = (0, parser_1.parseArgvWithPositional)(extraArgs, fuzzyMatched.optional, fuzzyMatched.argumentOptions);
            Object.assign(result.positionalArgs, parsedOptional.result);
            extraArgs = parsedOptional.unknownArgv;
        }
        // argv info in error
        const printArgv = Array.isArray(argv) ? argv.join(' ') : argv;
        // unknown commands, checking in strict mode
        if (extraArgs.length && this.binInfo.strictCommands) {
            result.error = errors_1.errors.command_is_not_found(`${this.binInfo.binName}${printArgv ? ` ${printArgv}` : ''}`);
            debug(result.error.message);
            return result;
        }
        // all pass
        result.matched = result.fuzzyMatched;
        debug('Final match result is %s', result.matched.clz.name);
        // match empty command or not enable command
        if (!result.matched.isRunable && this.binInfo.strictCommands) {
            result.error = errors_1.errors.command_is_not_implement(`${this.binInfo.binName}${printArgv ? ` ${printArgv}` : ''}`);
            debug(result.error.message);
        }
        return result;
    }
    /** parse argv with yargs-parser */
    parseArgs(argv, parseCommand) {
        const result = (0, parser_1.parseArgvToArgs)(argv, {
            optionConfig: parseCommand === null || parseCommand === void 0 ? void 0 : parseCommand.options,
            strictOptions: this.binInfo.strictOptions,
        });
        return result;
    }
    /** match command by argv */
    matchCommand(argv) {
        const result = this._matchCommand(argv);
        // parse again with parserOption and validation
        const parseResult = this.parseArgs(argv, result.fuzzyMatched);
        result.error = result.error || parseResult.error;
        // merge args and positional args
        result.args = Object.assign(parseResult.args, result.positionalArgs);
        return result;
    }
    /** get parsed command by command */
    getCommand(clz) {
        return this.tree.get(clz);
    }
};
tslib_1.__decorate([
    (0, core_1.Inject)(),
    tslib_1.__metadata("design:type", core_1.Container)
], ParsedCommands.prototype, "container", void 0);
tslib_1.__decorate([
    (0, core_1.Inject)(),
    tslib_1.__metadata("design:type", bin_info_1.BinInfo)
], ParsedCommands.prototype, "binInfo", void 0);
ParsedCommands = tslib_1.__decorate([
    (0, core_1.Injectable)({ scope: core_1.ScopeEnum.SINGLETON })
], ParsedCommands);
exports.ParsedCommands = ParsedCommands;
