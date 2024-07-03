"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCommand = void 0;
const node_util_1 = require("node:util");
const node_child_process_1 = require("node:child_process");
const artus_cli_1 = require("@artus-cli/artus-cli");
const debug = (0, node_util_1.debuglog)('egg-bin:base');
// only hook once and only when ever start any child.
const childs = new Set();
let hadHook = false;
function gracefull(proc) {
    // save child ref
    childs.add(proc);
    // only hook once
    /* c8 ignore else */
    if (!hadHook) {
        hadHook = true;
        let signal;
        ['SIGINT', 'SIGQUIT', 'SIGTERM'].forEach(event => {
            process.once(event, () => {
                signal = event;
                process.exit(0);
            });
        });
        process.once('exit', (code) => {
            for (const child of childs) {
                debug('process exit code: %o, kill child %o with %o', code, child.pid, signal);
                child.kill(signal);
            }
        });
    }
}
class ForkError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}
let BaseCommand = class BaseCommand extends artus_cli_1.Command {
    dryRun;
    require;
    ctx;
    utils;
    // FIXME: should has a better way to init global args default value
    get base() {
        return this.ctx.args.base;
    }
    async run() {
        await this.utils.redirect(['--help']);
    }
    async formatRequires() {
        const requires = this.require ?? [];
        const eggRequire = this.ctx.args.pkgEgg.require;
        if (Array.isArray(eggRequire)) {
            for (const r of eggRequire) {
                requires.push(r);
            }
        }
        else if (typeof eggRequire === 'string' && eggRequire) {
            requires.push(eggRequire);
        }
        return requires;
    }
    async forkNode(modulePath, args, options = {}) {
        if (this.dryRun) {
            console.log('dry run: $ %o', `${process.execPath} ${modulePath} ${args.join(' ')}`);
            return;
        }
        const forkExecArgv = [
            ...this.ctx.args.execArgv || [],
            ...options.execArgv || [],
        ];
        options = {
            stdio: 'inherit',
            env: this.ctx.env,
            cwd: this.base,
            ...options,
            execArgv: forkExecArgv,
        };
        const proc = (0, node_child_process_1.fork)(modulePath, args, options);
        debug('Run fork pid: %o, `%s %s %s`', proc.pid, process.execPath, modulePath, args.join(' '));
        gracefull(proc);
        return new Promise((resolve, reject) => {
            proc.once('exit', code => {
                debug('fork pid: %o exit code %o', proc.pid, code);
                childs.delete(proc);
                if (code !== 0) {
                    const err = new ForkError(modulePath + ' ' + args.join(' ') + ' exit with code ' + code, code);
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
};
exports.BaseCommand = BaseCommand;
__decorate([
    (0, artus_cli_1.Option)({
        description: 'whether show full command script only, default is false',
        alias: 'd',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], BaseCommand.prototype, "dryRun", void 0);
__decorate([
    (0, artus_cli_1.Option)({
        description: 'require the given module',
        alias: 'r',
        array: true,
        default: [],
    }),
    __metadata("design:type", Array)
], BaseCommand.prototype, "require", void 0);
__decorate([
    (0, artus_cli_1.Inject)(),
    __metadata("design:type", artus_cli_1.CommandContext)
], BaseCommand.prototype, "ctx", void 0);
__decorate([
    (0, artus_cli_1.Inject)(),
    __metadata("design:type", artus_cli_1.Utils)
], BaseCommand.prototype, "utils", void 0);
exports.BaseCommand = BaseCommand = __decorate([
    (0, artus_cli_1.DefineCommand)()
], BaseCommand);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbWQvYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBcUM7QUFDckMsMkRBQXFFO0FBQ3JFLG9EQU04QjtBQUU5QixNQUFNLEtBQUssR0FBRyxJQUFBLG9CQUFRLEVBQUMsY0FBYyxDQUFDLENBQUM7QUFFdkMscURBQXFEO0FBQ3JELE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxFQUFnQixDQUFDO0FBQ3ZDLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztBQUNwQixTQUFTLFNBQVMsQ0FBQyxJQUFrQjtJQUNuQyxpQkFBaUI7SUFDakIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVqQixpQkFBaUI7SUFDakIsb0JBQW9CO0lBQ3BCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNiLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDZixJQUFJLE1BQXNCLENBQUM7UUFDM0IsQ0FBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNqRCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7Z0JBQ3ZCLE1BQU0sR0FBRyxLQUF1QixDQUFDO2dCQUNqQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQVksRUFBRSxFQUFFO1lBQ3BDLEtBQUssTUFBTSxLQUFLLElBQUksTUFBTSxFQUFFLENBQUM7Z0JBQzNCLEtBQUssQ0FBQyw4Q0FBOEMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDL0UsS0FBSyxDQUFDLElBQUksQ0FB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