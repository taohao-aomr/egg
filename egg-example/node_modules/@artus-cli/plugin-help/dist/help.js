"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCommand = void 0;
const tslib_1 = require("tslib");
const artus_cli_1 = require("@artus-cli/artus-cli");
const command_line_usage_1 = tslib_1.__importDefault(require("command-line-usage"));
let HelpCommand = class HelpCommand extends artus_cli_1.Command {
    async run() {
        var _a;
        const ctx = this.ctx;
        const { binName: bin } = this.program;
        const command = this.command || bin;
        const commandUid = command.startsWith(bin) ? command : `${bin} ${command}`;
        const helpCommand = ctx.commands.get(commandUid) || ctx.rootCommand;
        // display help informations
        const displayTexts = [];
        const commandLineUsageList = [];
        const optionKeys = helpCommand.options ? Object.keys(helpCommand.options) : [];
        // usage info in first line
        displayTexts.push('Usage: ' +
            (helpCommand.command.startsWith(bin) ? '' : `${bin} `) +
            helpCommand.command +
            (helpCommand.isRunable ? '' : ' <cmd>'));
        if (helpCommand.description) {
            displayTexts.push('', helpCommand.description);
        }
        // show examples
        if ((_a = helpCommand.examples) === null || _a === void 0 ? void 0 : _a.length) {
            commandLineUsageList.push({
                header: 'Examples',
                content: helpCommand.examples
                    .map(info => ((info.description ? `# ${info.description}\n` : '') +
                    info.command))
                    .join('\n\n'),
            });
        }
        // available commands, display all subcommands if match the root command
        const availableCommands = (helpCommand.isRoot
            ? Array.from(new Set(ctx.commands.values()))
            : helpCommand.childs || []).filter(c => !c.isRoot && c.isRunable);
        if (availableCommands.length) {
            commandLineUsageList.push({
                header: 'Available Commands',
                content: availableCommands.map(command => ({
                    name: command.command,
                    summary: command.description,
                })),
            });
        }
        // options list, like -h, --help / -v, --version ...
        commandLineUsageList.push({
            header: 'Options',
            optionList: optionKeys
                .map(flag => {
                const option = helpCommand.options[flag];
                const showFlag = flag[0].toLowerCase() + flag.substring(1).replace(/[A-Z]/g, '-$&').toLowerCase();
                return {
                    name: showFlag,
                    type: { name: option.type || 'string' },
                    description: option.description,
                    alias: option.alias,
                    defaultValue: option.default,
                };
            }),
        });
        // use command-line-usage to format help informations.
        displayTexts.push((0, command_line_usage_1.default)(commandLineUsageList));
        console.info(displayTexts.join('\n'));
    }
};
tslib_1.__decorate([
    (0, artus_cli_1.Inject)(),
    tslib_1.__metadata("design:type", artus_cli_1.CommandContext)
], HelpCommand.prototype, "ctx", void 0);
tslib_1.__decorate([
    (0, artus_cli_1.Inject)(),
    tslib_1.__metadata("design:type", artus_cli_1.Program)
], HelpCommand.prototype, "program", void 0);
tslib_1.__decorate([
    (0, artus_cli_1.Option)(),
    tslib_1.__metadata("design:type", String)
], HelpCommand.prototype, "command", void 0);
HelpCommand = tslib_1.__decorate([
    (0, artus_cli_1.DefineCommand)({
        command: 'help [command]',
        description: 'show help infomation for command',
        alias: 'h',
    })
], HelpCommand);
exports.HelpCommand = HelpCommand;
