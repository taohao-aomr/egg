"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@artus/core");
const parsed_commands_1 = require("./parsed_commands");
const parsed_command_1 = require("./parsed_command");
const context_1 = require("./context");
const trigger_1 = require("./trigger");
const node_assert_1 = tslib_1.__importDefault(require("node:assert"));
const node_util_1 = require("node:util");
let Utils = class Utils {
    /** forward to other command in same pipeline */
    async forward(clz, args) {
        const cmd = clz instanceof parsed_command_1.ParsedCommand ? clz : this.commands.getCommand(clz);
        (0, node_assert_1.default)(cmd, (0, node_util_1.format)('Can not forward to command %s', cmd === null || cmd === void 0 ? void 0 : cmd.clz.name));
        Object.assign(this.ctx.args, this.commands.parseArgs(this.ctx.raw, cmd).args, args);
        return this.trigger.executeCommand(this.ctx, cmd);
    }
    /** create new pipeline to execute */
    async redirect(argv) {
        await this.trigger.executePipeline({ argv });
    }
};
tslib_1.__decorate([
    (0, core_1.Inject)(),
    tslib_1.__metadata("design:type", context_1.CommandContext)
], Utils.prototype, "ctx", void 0);
tslib_1.__decorate([
    (0, core_1.Inject)(),
    tslib_1.__metadata("design:type", trigger_1.CommandTrigger)
], Utils.prototype, "trigger", void 0);
tslib_1.__decorate([
    (0, core_1.Inject)(),
    tslib_1.__metadata("design:type", parsed_commands_1.ParsedCommands)
], Utils.prototype, "commands", void 0);
Utils = tslib_1.__decorate([
    (0, core_1.Injectable)({ scope: core_1.ScopeEnum.EXECUTION })
], Utils);
exports.Utils = Utils;
