"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const artus_cli_1 = require("@artus-cli/artus-cli");
let VersionLifecycle = class VersionLifecycle {
    async configDidLoad() {
        const { rootCommand } = this.program;
        this.program.option({
            version: {
                type: 'boolean',
                alias: 'v',
                description: 'Show Version',
            },
        }, [rootCommand]);
        // intercept root command and show version
        this.program.use(async (ctx, next) => {
            const { args, fuzzyMatched } = ctx;
            if (fuzzyMatched === rootCommand && args.version) {
                return console.info(this.program.version);
            }
            await next();
        });
    }
};
tslib_1.__decorate([
    (0, artus_cli_1.Inject)(),
    tslib_1.__metadata("design:type", artus_cli_1.Program)
], VersionLifecycle.prototype, "program", void 0);
tslib_1.__decorate([
    (0, artus_cli_1.LifecycleHook)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], VersionLifecycle.prototype, "configDidLoad", null);
VersionLifecycle = tslib_1.__decorate([
    (0, artus_cli_1.LifecycleHookUnit)()
], VersionLifecycle);
exports.default = VersionLifecycle;
