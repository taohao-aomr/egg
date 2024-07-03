"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const artus_cli_1 = require("@artus-cli/artus-cli");
const yargs_parser_1 = tslib_1.__importDefault(require("yargs-parser"));
let TemplateLifecycle = class TemplateLifecycle {
    async configDidLoad() {
        this.program.use(async (ctx, next) => {
            const _argv = ctx.args.getCompletionArgv;
            if (!_argv)
                return next();
            /** passthrough by `--get-completion-argv="xxx xxx"` */
            const argv = Array.isArray(_argv) ? _argv : _argv.split(/\s+/);
            const formatStr = str => str.replace(/:/, '\\:');
            const { fuzzyMatched } = this.parsedCommands.matchCommand(argv.slice(1));
            const completions = [];
            fuzzyMatched.childs
                .forEach(({ cmd, description }) => {
                completions.push(`${formatStr(cmd)}:${description}`);
            });
            Object.keys(fuzzyMatched.options)
                .forEach(flag => {
                const opt = fuzzyMatched.options[flag];
                completions.push(`--${formatStr(yargs_parser_1.default.decamelize(flag))}:${opt.description || flag}`);
            });
            process.stdout.write(completions.join('\n'));
        });
    }
};
tslib_1.__decorate([
    (0, artus_cli_1.Inject)(),
    tslib_1.__metadata("design:type", artus_cli_1.Program)
], TemplateLifecycle.prototype, "program", void 0);
tslib_1.__decorate([
    (0, artus_cli_1.Inject)(),
    tslib_1.__metadata("design:type", artus_cli_1.ParsedCommands)
], TemplateLifecycle.prototype, "parsedCommands", void 0);
tslib_1.__decorate([
    (0, artus_cli_1.LifecycleHook)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TemplateLifecycle.prototype, "configDidLoad", null);
TemplateLifecycle = tslib_1.__decorate([
    (0, artus_cli_1.LifecycleHookUnit)()
], TemplateLifecycle);
exports.default = TemplateLifecycle;
