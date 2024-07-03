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
exports.DevCommand = void 0;
const node_util_1 = require("node:util");
const node_path_1 = __importDefault(require("node:path"));
const artus_cli_1 = require("@artus-cli/artus-cli");
const utils_1 = __importDefault(require("@eggjs/utils"));
const detect_port_1 = __importDefault(require("detect-port"));
const base_1 = require("./base");
const debug = (0, node_util_1.debuglog)('egg-bin:dev');
let DevCommand = class DevCommand extends base_1.BaseCommand {
    port;
    workers;
    framework;
    sticky;
    async run() {
        debug('run dev: %o', this.ctx.args);
        this.ctx.env.NODE_ENV = this.ctx.env.NODE_ENV ?? 'development';
        this.ctx.env.EGG_MASTER_CLOSE_TIMEOUT = '1000';
        const serverBin = node_path_1.default.join(__dirname, '../../scripts/start-cluster.js');
        const eggStartOptions = await this.formatEggStartOptions();
        const args = [JSON.stringify(eggStartOptions)];
        const requires = await this.formatRequires();
        const execArgv = [];
        for (const r of requires) {
            execArgv.push('--require');
            execArgv.push(r);
        }
        await this.forkNode(serverBin, args, { execArgv });
    }
    async formatEggStartOptions() {
        this.framework = utils_1.default.getFrameworkPath({
            framework: this.framework,
            baseDir: this.base,
        });
        if (!this.port) {
            let configuredPort;
            try {
                const configuration = utils_1.default.getConfig({
                    framework: this.framework,
                    baseDir: this.base,
                    env: 'local',
                });
                configuredPort = configuration?.cluster?.listen?.port;
            }
            catch (_) { /** skip when failing to read the configuration */ }
            if (configuredPort) {
                this.port = configuredPort;
                debug(`use port ${this.port} from configuration file`);
            }
            else {
                const defaultPort = process.env.EGG_BIN_DEFAULT_PORT ?? 7001;
                debug('detect available port');
                this.port = await (0, detect_port_1.default)(defaultPort);
                if (this.port !== defaultPort) {
                    console.warn('[egg-bin] server port %s is in use, now using port %o', defaultPort, this.port);
                }
                debug(`use available port ${this.port}`);
            }
        }
        return {
            baseDir: this.base,
            workers: this.workers,
            port: this.port,
            framework: this.framework,
            typescript: this.ctx.args.typescript,
            tscompiler: this.ctx.args.tscompiler,
            sticky: this.sticky,
        };
    }
};
exports.DevCommand = DevCommand;
__decorate([
    (0, artus_cli_1.Option)({
        description: 'listening port, default to 7001',
        alias: 'p',
    }),
    __metadata("design:type", Number)
], DevCommand.prototype, "port", void 0);
__decorate([
    (0, artus_cli_1.Option)({
        description: 'numbers of app workers, default to 1 at local mode',
        alias: ['c', 'cluster'],
        default: 1,
    }),
    __metadata("design:type", Number)
], DevCommand.prototype, "workers", void 0);
__decorate([
    (0, artus_cli_1.Option)({
        description: 'specify framework that can be absolute path or npm package, default is egg',
    }),
    __metadata("design:type", String)
], DevCommand.prototype, "framework", void 0);
__decorate([
    (0, artus_cli_1.Option)({
        description: 'start a sticky cluster server, default to false',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], DevCommand.prototype, "sticky", void 0);
exports.DevCommand = DevCommand = __decorate([
    (0, artus_cli_1.DefineCommand)({
        command: 'dev',
        description: 'Start server at local dev mode',
        alias: ['d'],
    })
], DevCommand);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NtZC9kZXYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBQXFDO0FBQ3JDLDBEQUE2QjtBQUM3QixvREFBNkQ7QUFDN0QseURBQWlDO0FBQ2pDLDhEQUFpQztBQUNqQyxpQ0FBcUM7QUFFckMsTUFBTSxLQUFLLEdBQUcsSUFBQSxvQkFBUSxFQUFDLGFBQWEsQ0FBQyxDQUFDO0FBTy9CLElBQU0sVUFBVSxHQUFoQixNQUFNLFVBQVcsU0FBUSxrQkFBVztJQUt6QyxJQUFJLENBQVM7SUFPYixPQUFPLENBQVM7SUFLaEIsU0FBUyxDQUFTO0lBT2xCLE1BQU0sQ0FBVTtJQUVoQixLQUFLLENBQUMsR0FBRztRQUNQLEtBQUssQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxJQUFJLGFBQWEsQ0FBQztRQUMvRCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsR0FBRyxNQUFNLENBQUM7UUFDL0MsTUFBTSxTQUFTLEdBQUcsbUJBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGdDQUFnQyxDQUFDLENBQUM7UUFDekUsTUFBTSxlQUFlLEdBQUcsTUFBTSxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUMzRCxNQUFNLElBQUksR0FBRyxDQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUUsQ0FBQztRQUNqRCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUM3QyxNQUFNLFFBQVEsR0FBYSxFQUFFLENBQUM7UUFDOUIsS0FBSyxNQUFNLENBQUMsSUFBSSxRQUFRLEVBQUUsQ0FBQztZ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