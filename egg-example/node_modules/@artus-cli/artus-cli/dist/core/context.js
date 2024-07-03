"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandContext = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@artus/core");
const pipeline_1 = require("@artus/pipeline");
const parsed_commands_1 = require("./parsed_commands");
const RAW_SYMBOL = Symbol('CommandContext#raw');
/**
 * Command Context, store `argv`/`env`/`cwd`/`match result` ...
 */
let CommandContext = class CommandContext extends pipeline_1.Context {
    init() {
        const params = this.input.params;
        this.env = params.env;
        this.cwd = params.cwd;
        this.raw = params.argv;
        return this;
    }
    /**
     * same as argv in process.argv
     * using `raw` instead of `argv` to avoid feeling confusing between `argv` and `args`
     */
    get raw() {
        return this[RAW_SYMBOL];
    }
    set raw(val) {
        this[RAW_SYMBOL] = val;
        this.parse();
    }
    get commands() {
        return this.parsedCommands.commands;
    }
    get rootCommand() {
        return this.parsedCommands.root;
    }
    get args() {
        return this.matchResult.args;
    }
    get fuzzyMatched() {
        return this.matchResult.fuzzyMatched;
    }
    get matched() {
        return this.matchResult.matched;
    }
    get error() {
        return this.matchResult.error;
    }
    parse() {
        this.matchResult = this.parsedCommands.matchCommand(this.raw);
    }
};
tslib_1.__decorate([
    (0, core_1.Inject)(),
    tslib_1.__metadata("design:type", parsed_commands_1.ParsedCommands)
], CommandContext.prototype, "parsedCommands", void 0);
CommandContext = tslib_1.__decorate([
    (0, core_1.Injectable)({ scope: core_1.ScopeEnum.SINGLETON })
], CommandContext);
exports.CommandContext = CommandContext;
