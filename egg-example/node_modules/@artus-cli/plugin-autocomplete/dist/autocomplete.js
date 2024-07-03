"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoCompleteCommand = void 0;
const tslib_1 = require("tslib");
const artus_cli_1 = require("@artus-cli/artus-cli");
const inquirer_1 = tslib_1.__importDefault(require("inquirer"));
const node_os_1 = tslib_1.__importDefault(require("node:os"));
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const scripts_1 = tslib_1.__importDefault(require("./scripts"));
const supportShellTypes = ['zsh', 'bash'];
let AutoCompleteCommand = class AutoCompleteCommand extends artus_cli_1.Command {
    async run() {
        let shell = this.shell;
        if (node_os_1.default.platform() === 'win32') {
            console.info('Autocomplete is not support windows');
            return;
        }
        if (!shell || !supportShellTypes.includes(shell)) {
            const result = await inquirer_1.default.prompt([{
                    name: 'shell',
                    type: 'list',
                    message: 'Please choice your shell type',
                    choices: supportShellTypes,
                }]);
            shell = result.shell;
        }
        const rcFile = node_path_1.default.resolve(node_os_1.default.homedir(), shell === 'zsh' ? '.zshrc' : '.bashrc');
        const script = scripts_1.default[shell](this.program.binName, process.argv[1]);
        console.info(`\nPlease copy the scripts to ${rcFile} manually.`);
        console.info(script);
    }
};
tslib_1.__decorate([
    (0, artus_cli_1.Inject)(),
    tslib_1.__metadata("design:type", artus_cli_1.Program)
], AutoCompleteCommand.prototype, "program", void 0);
tslib_1.__decorate([
    (0, artus_cli_1.Option)(),
    tslib_1.__metadata("design:type", String)
], AutoCompleteCommand.prototype, "shell", void 0);
AutoCompleteCommand = tslib_1.__decorate([
    (0, artus_cli_1.DefineCommand)({
        command: 'autocomplete [shell]',
        description: 'autocomplete installation',
    })
], AutoCompleteCommand);
exports.AutoCompleteCommand = AutoCompleteCommand;
