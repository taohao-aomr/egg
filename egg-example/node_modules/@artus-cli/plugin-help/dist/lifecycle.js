"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const artus_cli_1 = require("@artus-cli/artus-cli");
let UsageLifecycle = class UsageLifecycle {
    async configDidLoad() {
        // add global options
        this.program.option({
            help: {
                type: 'boolean',
                description: 'Show Help',
                alias: 'h',
            },
        });
        this.program.use(async (ctx, next) => {
            const { binName: bin } = this.program;
            if (ctx.fuzzyMatched && ctx.args.help) {
                // redirect to help command
                const utils = ctx.container.get(artus_cli_1.Utils);
                return utils.redirect(['help', ctx.fuzzyMatched.uid]);
            }
            try {
                await next();
            }
            catch (e) {
                if (e instanceof artus_cli_1.ArtusCliError) {
                    // built-in error in artus-cli
                    console.error(`\n ${e.message}, try '${ctx.fuzzyMatched.cmds.join(' ') || bin} --help' for more information.\n`);
                    process.exit(1);
                }
                throw e;
            }
        });
    }
};
tslib_1.__decorate([
    (0, artus_cli_1.Inject)(),
    tslib_1.__metadata("design:type", artus_cli_1.Program)
], UsageLifecycle.prototype, "program", void 0);
tslib_1.__decorate([
    (0, artus_cli_1.LifecycleHook)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UsageLifecycle.prototype, "configDidLoad", null);
UsageLifecycle = tslib_1.__decorate([
    (0, artus_cli_1.LifecycleHookUnit)()
], UsageLifecycle);
exports.default = UsageLifecycle;
