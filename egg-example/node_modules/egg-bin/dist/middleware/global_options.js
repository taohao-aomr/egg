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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_util_1 = require("node:util");
const node_path_1 = __importDefault(require("node:path"));
const node_url_1 = require("node:url");
const artus_cli_1 = require("@artus-cli/artus-cli");
const runscript_1 = __importDefault(require("runscript"));
const utils_1 = require("../utils");
const debug = (0, node_util_1.debuglog)('egg-bin:midddleware:global_options');
let GlobalOptions = class GlobalOptions {
    program;
    async configDidLoad() {
        // add global options
        this.program.option({
            base: {
                description: 'directory of application, default to `process.cwd()`',
                type: 'string',
                alias: 'baseDir',
            },
            declarations: {
                description: 'whether create typings, will add `--require egg-ts-helper/register`',
                type: 'boolean',
                alias: 'dts',
            },
            typescript: {
                description: 'whether enable typescript support',
                type: 'boolean',
                alias: 'ts',
            },
            tscompiler: {
                description: 'ts compiler, like ts-node/register, ts-node/register/transpile-only, @swc-node/register, esbuild-register etc',
                type: 'string',
                alias: 'tsc',
            },
        });
        this.program.use(async (ctx, next) => {
            debug('before next');
            if (!ctx.args.base) {
                ctx.args.base = ctx.cwd;
                debug('ctx.args.base not set, auto set it to cwd: %o', ctx.cwd);
            }
            if (!node_path_1.default.isAbsolute(ctx.args.base)) {
                ctx.args.base = node_path_1.default.join(ctx.cwd, ctx.args.base);
            }
            debug('matched cmd: %o, ctx.args.base: %o', ctx.matched?.cmd, ctx.args.base);
            const pkg = await (0, utils_1.readPackageJSON)(ctx.args.base);
            ctx.args.pkgEgg = pkg.egg ?? {};
            const tscompiler = ctx.args.tscompiler ?? ctx.env.TS_COMPILER ?? ctx.args.pkgEgg.tscompiler;
            if (ctx.args.typescript === undefined) {
                // try to ready EGG_TYPESCRIPT env first, only accept 'true' or 'false' string
                if (ctx.env.EGG_TYPESCRIPT === 'false') {
                    ctx.args.typescript = false;
                    debug('detect typescript=%o from EGG_TYPESCRIPT=%o', false, ctx.env.EGG_TYPESCRIPT);
                }
                else if (ctx.env.EGG_TYPESCRIPT === 'true') {
                    ctx.args.typescript = true;
                    debug('detect typescript=%o from EGG_TYPESCRIPT=%o', true, ctx.env.EGG_TYPESCRIPT);
                }
                else if (typeof ctx.args.pkgEgg.typescript === 'boolean') {
                    // read `egg.typescript` from package.json if not pass argv
                    ctx.args.typescript = ctx.args.pkgEgg.typescript;
                    debug('detect typescript=%o from pkg.egg.typescript=%o', true, ctx.args.pkgEgg.typescript);
                }
                else if (pkg.dependencies?.typescript) {
                    // auto detect pkg.dependencies.typescript or pkg.devDependencies.typescript
                    ctx.args.typescript = true;
                    debug('detect typescript=%o from pkg.dependencies.typescript=%o', true, pkg.dependencies.typescript);
                }
                else if (pkg.devDependencies?.typescript) {
                    ctx.args.typescript = true;
                    debug('detect typescript=%o from pkg.devDependencies.typescript=%o', true, pkg.devDependencies.typescript);
                }
                else if (await (0, utils_1.hasTsConfig)(ctx.args.base)) {
                    // tsconfig.json exists
                    ctx.args.typescript = true;
                    debug('detect typescript=%o cause tsconfig.json exists', true);
                }
                else if (tscompiler) {
                    ctx.args.typescript = true;
                    debug('detect typescript=%o from --tscompiler=%o', true, tscompiler);
                }
            }
            if (ctx.args.typescript) {
                const findPaths = [node_path_1.default.dirname(__dirname)];
                if (tscompiler) {
                    // try app baseDir first on custom tscompiler
                    findPaths.unshift(ctx.args.base);
                }
                ctx.args.tscompiler = tscompiler ?? 'ts-node/register';
                const tsNodeRegister = require.resolve(ctx.args.tscompiler, {
                    paths: findPaths,
                });
                // should require tsNodeRegister on current process, let it can require *.ts files
                // e.g.: dev command will execute egg loader to find configs and plugins
                require(tsNodeRegister);
                // let child process auto require ts-node too
                (0, utils_1.addNodeOptionsToEnv)(`--require ${tsNodeRegister}`, ctx.env);
                // tell egg loader to load ts file
                // see https://github.com/eggjs/egg-core/blob/master/lib/loader/egg_loader.js#L443
                ctx.env.EGG_TYPESCRIPT = 'true';
                // set current process.env.EGG_TYPESCRIPT too
                process.env.EGG_TYPESCRIPT = 'true';
                // load files from tsconfig on startup
                ctx.env.TS_NODE_FILES = process.env.TS_NODE_FILES ?? 'true';
                // keep same logic with egg-core, test cmd load files need it
                // see https://github.com/eggjs/egg-core/blob/master/lib/loader/egg_loader.js#L49
                (0, utils_1.addNodeOptionsToEnv)(`--require ${require.resolve('tsconfig-paths/register')}`, ctx.env);
            }
            if (pkg.type === 'module') {
                // use ts-node/esm loader on esm
                let esmLoader = require.resolve('ts-node/esm');
                if (process.platform === 'win32') {
                    // ES Module loading with abolute path fails on windows
                    // https://github.com/nodejs/node/issues/31710#issuecomment-583916239
                    // https://nodejs.org/api/url.html#url_url_pathtofileurl_path
                    esmLoader = (0, node_url_1.pathToFileURL)(esmLoader).href;
                }
                // wait for https://github.com/nodejs/node/issues/40940
                (0, utils_1.addNodeOptionsToEnv)('--no-warnings', ctx.env);
                (0, utils_1.addNodeOptionsToEnv)(`--loader ${esmLoader}`, ctx.env);
            }
            if (ctx.args.declarations === undefined) {
                if (typeof ctx.args.pkgEgg.declarations === 'boolean') {
                    // read `egg.declarations` from package.json if not pass argv
                    ctx.args.declarations = ctx.args.pkgEgg.declarations;
                    debug('detect declarations from pkg.egg.declarations=%o', ctx.args.pkgEgg.declarations);
                }
            }
            if (ctx.args.declarations) {
                const etsBin = require.resolve('egg-ts-helper/dist/bin');
                debug('run ets first: %o', etsBin);
                await (0, runscript_1.default)(`node ${etsBin}`);
            }
            if (ctx.args.pkgEgg.revert) {
                ctx.args.execArgv = ctx.args.execArgv || [];
                const reverts = Array.isArray(ctx.args.pkgEgg.revert) ? ctx.args.pkgEgg.revert : [ctx.args.pkgEgg.revert];
                for (const revert of reverts) {
                    ctx.args.execArgv.push(`--security-revert=${revert}`);
                }
            }
            debug('set NODE_OPTIONS: %o', ctx.env.NODE_OPTIONS);
            debug('ctx.args: %o', ctx.args);
            debug('enter next');
            await next();
            debug('after next');
        });
    }
};
__decorate([
    (0, artus_cli_1.Inject)(),
    __metadata("design:type", artus_cli_1.Program)
], GlobalOptions.prototype, "program", void 0);
__decorate([
    (0, artus_cli_1.LifecycleHook)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GlobalOptions.prototype, "configDidLoad", null);
GlobalOptions = __decorate([
    (0, artus_cli_1.LifecycleHookUnit)()
], GlobalOptions);
exports.default = GlobalOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsX29wdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlkZGxld2FyZS9nbG9iYWxfb3B0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFxQztBQUNyQywwREFBNkI7QUFDN0IsdUNBQXlDO0FBQ3pDLG9EQUc4QjtBQUM5QiwwREFBa0M7QUFDbEMsb0NBQTZFO0FBRTdFLE1BQU0sS0FBSyxHQUFHLElBQUEsb0JBQVEsRUFBQyxvQ0FBb0MsQ0FBQyxDQUFDO0FBRzlDLElBQU0sYUFBYSxHQUFuQixNQUFNLGFBQWE7SUFFZixPQUFPLENBQVU7SUFHNUIsQUFBTixLQUFLLENBQUMsYUFBYTtRQUNqQixxQkFBcUI7UUFDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDbEIsSUFBSSxFQUFFO2dCQUNKLFdBQVcsRUFBRSxzREFBc0Q7Z0JBQ25FLElBQUksRUFBRSxRQUFRO2dCQUNkLEtBQUssRUFBRSxTQUFTO2FBQ2pCO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLFdBQVcsRUFBRSxxRUFBcUU7Z0JBQ2xGLElBQUksRUFBRSxTQUFTO2dCQUNmLEtBQUssRUFBRSxLQUFLO2FBQ2I7WUFDRCxVQUFVLEVBQUU7Z0JBQ1YsV0FBVyxFQUFFLG1DQUFtQztnQkFDaEQsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsS0FBSyxFQUFFLElBQUk7YUFDWjtZQUNELFVBQVUsRUFBRTtnQkFDVixXQUFXLEVBQUUsK0dBQStHO2dCQUM1SCxJQUFJLEVBQUUsUUFBUTtnQkFDZCxLQUFLLEVBQUUsS0FBSzthQUNiO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQW1CLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDbkQsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElB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