"use strict";
/**
 * open api for user
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@artus/core");
const trigger_1 = require("./trigger");
const bin_info_1 = require("./bin_info");
const parsed_commands_1 = require("./parsed_commands");
const parsed_command_1 = require("./parsed_command");
let Program = class Program {
    /** all commands map */
    get commands() {
        return this.parsedCommands.commands;
    }
    /** root of command tree */
    get rootCommand() {
        return this.parsedCommands.root;
    }
    /** the bin name */
    get binName() {
        return this.binInfo.binName;
    }
    /** package name */
    get name() {
        return this.binInfo.name;
    }
    /** package version */
    get version() {
        return this.binInfo.version;
    }
    /** bin base dir */
    get baseDir() {
        return this.binInfo.baseDir;
    }
    getParsedCommand(clz) {
        return clz instanceof parsed_command_1.ParsedCommand ? clz : this.parsedCommands.getCommand(clz);
    }
    /** add options, works in all command by default */
    option(opt, effectCommands) {
        effectCommands = effectCommands || Array.from(this.commands.values());
        effectCommands.forEach(c => { var _a; return (_a = this.getParsedCommand(c)) === null || _a === void 0 ? void 0 : _a.updateGlobalOptions(opt); });
    }
    /** disable command dynamically */
    disableCommand(clz) {
        const parsedCommand = this.getParsedCommand(clz);
        if (parsedCommand)
            parsedCommand.enable = false;
    }
    /** enable command dynamically */
    enableCommand(clz) {
        const parsedCommand = this.getParsedCommand(clz);
        if (parsedCommand)
            parsedCommand.enable = true;
    }
    /** register pipeline middleware */
    use(fn) {
        return this.trigger.use(fn);
    }
    /** register middleware in command */
    useInCommand(clz, fn, opt) {
        const parsedCommand = this.getParsedCommand(clz);
        if (parsedCommand)
            parsedCommand.addMiddlewares('command', Object.assign(Object.assign({}, opt), { middleware: fn }));
    }
    /** register middleware in command.run */
    useInExecution(clz, fn, opt) {
        const parsedCommand = this.getParsedCommand(clz);
        if (parsedCommand)
            parsedCommand.addMiddlewares('execution', Object.assign(Object.assign({}, opt), { middleware: fn }));
    }
};
tslib_1.__decorate([
    (0, core_1.Inject)(),
    tslib_1.__metadata("design:type", trigger_1.CommandTrigger)
], Program.prototype, "trigger", void 0);
tslib_1.__decorate([
    (0, core_1.Inject)(),
    tslib_1.__metadata("design:type", parsed_commands_1.ParsedCommands)
], Program.prototype, "parsedCommands", void 0);
tslib_1.__decorate([
    (0, core_1.Inject)(),
    tslib_1.__metadata("design:type", bin_info_1.BinInfo)
], Program.prototype, "binInfo", void 0);
Program = tslib_1.__decorate([
    (0, core_1.Injectable)({ scope: core_1.ScopeEnum.SINGLETON })
], Program);
exports.Program = Program;
