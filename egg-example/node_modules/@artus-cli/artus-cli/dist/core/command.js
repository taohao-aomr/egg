"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyCommand = exports.Command = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@artus/core");
class Command {
}
exports.Command = Command;
let EmptyCommand = class EmptyCommand extends Command {
    async run() {
        throw new Error('should not call empty command');
    }
};
EmptyCommand = tslib_1.__decorate([
    (0, core_1.Injectable)()
], EmptyCommand);
exports.EmptyCommand = EmptyCommand;
