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
exports.TestCommand = void 0;
const node_util_1 = require("node:util");
const node_os_1 = __importDefault(require("node:os"));
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const artus_cli_1 = require("@artus-cli/artus-cli");
const globby_1 = __importDefault(require("globby"));
const jest_changed_files_1 = require("jest-changed-files");
const base_1 = require("./base");
const debug = (0, node_util_1.debuglog)('egg-bin:test');
let TestCommand = class TestCommand extends base_1.BaseCommand {
    files;
    timeout;
    grep;
    changed;
    parallel;
    jobs;
    autoAgent;
    mochawesome;
    bail;
    async run() {
        try {
            await promises_1.default.access(this.base);
        }
        catch (err) {
            console.error('baseDir: %o not exists', this.base);
            throw err;
        }
        const mochaFile = process.env.MOCHA_FILE || require.resolve('mocha/bin/_mocha');
        if (this.parallel) {
            this.ctx.env.ENABLE_MOCHA_PARALLEL = 'true';
            if (this.autoAgent) {
                this.ctx.env.AUTO_AGENT = 'true';
            }
        }
        // set NODE_ENV=test, let egg application load unittest logic
        // https://eggjs.org/basics/env#difference-from-node_env
        this.ctx.env.NODE_ENV = 'test';
        debug('run test: %s %o', mochaFile, this.ctx.args);
        const mochaArgs = await this.formatMochaArgs();
        if (!mochaArgs)
            return;
        await this.forkNode(mochaFile, mochaArgs, {
            execArgv: [
                ...process.execArgv,
                // https://github.com/mochajs/mocha/issues/2640#issuecomment-1663388547
                '--unhandled-rejections=strict',
            ],
        });
    }
    async formatMochaArgs() {
        // collect require
        const requires = await this.formatRequires();
        try {
            const eggMockRegister = require.resolve('egg-mock/register', { paths: [this.base] });
            requires.push(eggMockRegister);
            debug('auto register egg-mock: %o', eggMockRegister);
        }
        catch (err) {
            // ignore egg-mock not exists
            debug('auto register egg-mock fail, can not require egg-mock on %o, error: %s', this.base, err.message);
        }
        // handle mochawesome enable
        let reporter = this.ctx.env.TEST_REPORTER;
        let reporterOptions = '';
        if (!reporter && this.mochawesome) {
            // use https://github.com/node-modules/mochawesome/pull/1 instead
            reporter = require.resolve('mochawesome-with-mocha');
            reporterOptions = 'reportDir=node_modules/.mochawesome-reports';
            if (this.parallel) {
                // https://github.com/adamgruber/mochawesome#parallel-mode
                requires.push(require.resolve('mochawesome-with-mocha/register'));
            }
        }
        const ext = this.ctx.args.typescript ? 'ts' : 'js';
        let pattern = this.files;
        // changed
        if (this.changed) {
            pattern = await this.getChangedTestFiles(this.base, ext);
            if (!pattern.length) {
                console.log('No changed test files');
                return;
            }
            debug('changed files: %o', pattern);
        }
        if (!pattern.length && process.env.TESTS) {
            pattern = process.env.TESTS.split(',');
        }
        // collect test files when nothing is changed
        if (!pattern.length) {
            pattern = [`test/**/*.test.${ext}`];
        }
        pattern = pattern.concat(['!test/fixtures', '!test/node_modules']);
        // expand glob and skip node_modules and fixtures
        const files = globby_1.default.sync(pattern, { cwd: this.base });
        files.sort();
        if (files.length === 0) {
            console.log(`No test files found with ${pattern}`);
            return;
        }
        // auto add setup file as the first test file
        const setupFile = node_path_1.default.join(this.base, `test/.setup.${ext}`);
        try {
            await promises_1.default.access(setupFile);
            files.unshift(setupFile);
        }
        catch {
            // ignore
        }
        return [
            this.dryRun ? '--dry-run' : '',
            // force exit
            '--exit',
            this.bail ? '--bail' : '',
            this.grep.map(pattern => `--grep='${pattern}'`).join(' '),
            this.timeout === false ? '--no-timeout' : `--timeout=${this.timeout}`,
            this.parallel ? '--parallel' : '',
            this.parallel && this.jobs ? `--jobs=${this.jobs}` : '',
            reporter ? `--reporter=${reporter}` : '',
            reporterOptions ? `--reporter-options=${reporterOptions}` : '',
            ...requires.map(r => `--require=${r}`),
            ...files,
        ].filter(a => a.trim());
    }
    async getChangedTestFiles(dir, ext) {
        const res = await (0, jest_changed_files_1.getChangedFilesForRoots)([node_path_1.default.join(dir, 'test')], {});
        const changedFiles = res.changedFiles;
        const files = [];
        for (let cf of changedFiles) {
            // only find test/**/*.test.(js|ts)
            if (cf.endsWith(`.test.${ext}`)) {
                // Patterns MUST use forward slashes (not backslashes)
                // This should be converted on Windows
                if (process.platform === 'win32') {
                    cf = cf.replace(/\\/g, '/');
                }
                files.push(cf);
            }
        }
        return files;
    }
};
exports.TestCommand = TestCommand;
__decorate([
    (0, artus_cli_1.Option)({
        default: [],
        array: true,
        type: 'string',
    }),
    __metadata("design:type", Array)
], TestCommand.prototype, "files", void 0);
__decorate([
    (0, artus_cli_1.Option)({
        description: 'set test-case timeout in milliseconds, default is 60000',
        alias: 't',
        default: process.env.TEST_TIMEOUT ?? 60000,
    }),
    __metadata("design:type", Object)
], TestCommand.prototype, "timeout", void 0);
__decorate([
    (0, artus_cli_1.Option)({
        description: 'only run tests matching <pattern>',
        alias: 'g',
        type: 'string',
        array: true,
        default: [],
    }),
    __metadata("design:type", Array)
], TestCommand.prototype, "grep", void 0);
__decorate([
    (0, artus_cli_1.Option)({
        description: 'only test with changed files and match test/**/*.test.(js|ts), default is false',
        alias: 'c',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], TestCommand.prototype, "changed", void 0);
__decorate([
    (0, artus_cli_1.Option)({
        description: 'mocha parallel mode, default is false',
        alias: 'p',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], TestCommand.prototype, "parallel", void 0);
__decorate([
    (0, artus_cli_1.Option)({
        description: 'number of jobs to run in parallel',
        type: 'number',
        default: node_os_1.default.cpus().length - 1,
    }),
    __metadata("design:type", Number)
], TestCommand.prototype, "jobs", void 0);
__decorate([
    (0, artus_cli_1.Option)({
        description: 'auto bootstrap agent in mocha master process, default is true',
        type: 'boolean',
        default: true,
    }),
    __metadata("design:type", Boolean)
], TestCommand.prototype, "autoAgent", void 0);
__decorate([
    (0, artus_cli_1.Option)({
        description: 'enable mochawesome reporter, default is true',
        type: 'boolean',
        default: true,
    }),
    __metadata("design:type", Boolean)
], TestCommand.prototype, "mochawesome", void 0);
__decorate([
    (0, artus_cli_1.Option)({
        description: 'bbort ("bail") after first test failure',
        alias: 'b',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], TestCommand.prototype, "bail", void 0);
exports.TestCommand = TestCommand = __decorate([
    (0, artus_cli_1.DefineCommand)({
        command: 'test [files...]',
        description: 'Run the test',
        alias: ['t'],
    })
], TestCommand);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbWQvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBcUM7QUFDckMsc0RBQXlCO0FBQ3pCLGdFQUFrQztBQUNsQywwREFBNkI7QUFDN0Isb0RBRThCO0FBQzlCLG9EQUE0QjtBQUM1QiwyREFBNkQ7QUFDN0QsaUNBQXFDO0FBRXJDLE1BQU0sS0FBSyxHQUFHLElBQUEsb0JBQVEsRUFBQyxjQUFjLENBQUMsQ0FBQztBQU9oQyxJQUFNLFdBQVcsR0FBakIsTUFBTSxXQUFZLFNBQVEsa0JBQVc7SUFNMUMsS0FBSyxDQUFXO0lBT2hCLE9BQU8sQ0FBbUI7SUFTMUIsSUFBSSxDQUFXO0lBUWYsT0FBTyxDQUFVO0lBUWpCLFFBQVEsQ0FBVTtJQU9sQixJQUFJLENBQVM7SUFPYixTQUFTLENBQVU7SUFPbkIsV0FBVyxDQUFVO0lBUXJCLElBQUksQ0FBVTtJQUVkLEtBQUssQ0FBQyxHQUFHO1FBQ1AsSUFBSSxDQUFDO1lBQ0gsTUFBTSxrQkFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsQ0FBQztRQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLHdCQUF3QixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuRCxNQUFNLEdBQUcsQ0FBQztRQUNaLENBQUM7UUFFRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDaEYsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMscUJBQXFCLEdBQUcsTUFBTSxDQUFDO1lBQzVDLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO1lBQ25DLENBQUM7UUFDSCxDQUFDO1FBQ0QsNkRBQTZEO1FBQzdELHdEQUF3RDtRQUN4RCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO1FBQy9CLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVuRCxNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUMvQyxJQUFJLENBQUMsU0FBUztZQUFFLE9BQU87UUFDdkIsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUU7WUFDeEMsUUFBUSxFQUFFO2dCQUNSLEdBQUcsT0FBTyxDQUFDLFFBQVE7Z0JBQ25CLHVFQUF1RTtnQkFDdkUsK0JBQStCO2FBQ2hDO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVTLEtBQUssQ0FBQyxlQUFlO1FBQzdCLGtCQUFrQjtRQUNsQixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUM7WUFDSCxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUUsSUFBSSxDQUFDLElBQUksQ0FBRSxFQUFFLENBQUMsQ0FBQztZQUN2RixRQUFRLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQy9CLEtBQUssQ0FBQyw0QkFBNEIsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUN2RCxDQUFDO1FBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNiLDZCQUE2QjtZQUM3QixLQUFLLENBQUMsd0VBQXdFLEVBQzVFLElBQUksQ0FBQyxJQUFJLEVBQUcsR0FBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7UUFFRCw0QkFBNEI7UUFDNUIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDO1FBQzFDLElBQUksZUFBZSxHQUFHLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNsQyxpRUFBaUU7WUFDakUsUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUNyRCxlQUFlLEdBQUcsNkNBQTZDLENBQUM7WUFDaEUsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ2xCLDBEQUEwRDtnQkFDMUQsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLENBQUMsQ0FBQztZQUNwRSxDQUFDO1FBQ0gsQ0FBQztRQUVELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDbkQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN6QixVQUFVO1FBQ1YsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDakIsT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDekQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO2dCQUNyQyxPQUFPO1lBQ1QsQ0FBQztZQUNELEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUN6QyxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pDLENBQUM7UUFFRCw2Q0FBNkM7UUFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNwQixPQUFPLEdBQUcsQ0FBRSxrQkFBa0IsR0FBRyxFQUFFLENBQUUsQ0FBQztRQUN4QyxDQUFDO1FBQ0QsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBRSxnQkFBZ0IsRUFBRSxvQkFBb0IsQ0FBRSxDQUFDLENBQUM7UUFFckUsaURBQWlEO1FBQ2pELE1BQU0sS0FBSyxHQUFHLGdCQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN2RCxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFYixJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUNuRCxPQUFPO1FBQ1QsQ0FBQztRQUVELDZDQUE2QztRQUM3QyxNQUFNLFNBQVMsR0FBRyxtQkFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGVBQWUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUM7WUFDSCxNQUFNLGtCQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzNCLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDM0IsQ0FBQztRQUFDLE1BQU0sQ0FBQztZQUNQLFNBQVM7UUFDWCxDQUFDO1FBRUQsT0FBTztZQUNMLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM5QixhQUFhO1lBQ2IsUUFBUTtZQUNSLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFdBQVcsT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQ3pELElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLGFBQWEsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNyRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDakMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN2RCxRQUFRLENBQUMsQ0FBQyxDQUFDLGNBQWMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDeEMsZUFBZSxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDOUQsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQztZQUN0QyxHQUFHLEtBQUs7U0FDVCxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFUyxLQUFLLENBQUMsbUJBQW1CLENBQUMsR0FBVyxFQUFFLEdBQVc7UUFDMUQsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFBLDRDQUF1QixFQUFDLENBQUUsbUJBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDMUUsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQztRQUN0QyxNQUFNLEtBQUssR0FBYSxFQUFFLENBQUM7UUFDM0IsS0FBSyxJQUFJLEVBQUUsSUFBSSxZQUFZLEVBQUUsQ0FBQztZQUM1QixtQ0FBbUM7WUFDbkMsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUNoQyxzREFBc0Q7Z0JBQ3RELHNDQUFzQztnQkFDdEMsSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sRUFBRSxDQUFDO29CQUNqQyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzlCLENBQUM7Z0JBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNqQixDQUFDO1FBQ0gsQ0FBQztRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztDQUNGLENBQUE7QUF2TVksa0NBQVc7QUFNdEI7SUFMQyxJQUFBLGtCQUFNLEVBQUM7UUFDTixPQUFPLEVBQUUsRUFBRTtRQUNYLEtBQUssRUFBRSxJQUFJO1FBQ1gsSUFBSSxFQUFFLFFBQVE7S0FDZixDQUFDOzswQ0FDYztBQU9oQjtJQUxDLElBQUEsa0JBQU0sRUFBQztRQUNOLFdBQVcsRUFBRSx5REFBeUQ7UUFDdEUsS0FBSyxFQUFFLEdBQUc7UUFDVixPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLElBQUksS0FBSztLQUMzQyxDQUFDOzs0Q0FDd0I7QUFTMUI7SUFQQyxJQUFBLGtCQUFNLEVBQUM7UUFDTixXQUFXLEVBQUUsbUNBQW1DO1FBQ2hELEtBQUssRUFBRSxHQUFHO1FBQ1YsSUFBSSxFQUFFLFFBQVE7UUFDZCxLQUFLLEVBQUUsSUFBSTtRQUNYLE9BQU8sRUFBRSxFQUFFO0tBQ1osQ0FBQzs7eUNBQ2E7QUFRZjtJQU5DLElBQUEsa0JBQU0sRUFBQztRQUNOLFdBQVcsRUFBRSxpRkFBaUY7UUFDOUYsS0FBSyxFQUFFLEdBQUc7UUFDVixJQUFJLEVBQUUsU0FBUztRQUNmLE9BQU8sRUFBRSxLQUFLO0tBQ2YsQ0FBQzs7NENBQ2U7QUFRakI7SUFOQyxJQUFBLGtCQUFNLEVBQUM7UUFDTixXQUFXLEVBQUUsdUNBQXVDO1FBQ3BELEtBQUssRUFBRSxHQUFHO1FBQ1YsSUFBSSxFQUFFLFNBQVM7UUFDZixPQUFPLEVBQUUsS0FBSztLQUNmLENBQUM7OzZDQUNnQjtBQU9sQjtJQUxDLElBQUEsa0JBQU0sRUFBQztRQUNOLFdBQVcsRUFBRSxtQ0FBbUM7UUFDaEQsSUFBSSxFQUFFLFFBQVE7UUFDZCxPQUFPLEVBQUUsaUJBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQztLQUM5QixDQUFDOzt5Q0FDVztBQU9iO0lBTEMsSUFBQSxrQkFBTSxFQUFDO1FBQ04sV0FBVyxFQUFFLCtEQUErRDtRQUM1RSxJQUFJLEVBQUUsU0FBUztRQUNmLE9BQU8sRUFBRSxJQUFJO0tBQ2QsQ0FBQzs7OENBQ2lCO0FBT25CO0lBTEMsSUFBQSxrQkFBTSxFQUFDO1FBQ04sV0FBVyxFQUFFLDhDQUE4QztRQUMzRCxJQUFJLEVBQUUsU0FBUztRQUNmLE9BQU8sRUFBRSxJQUFJO0tBQ2QsQ0FBQzs7Z0RBQ21CO0FBUXJCO0lBTkMsSUFBQSxrQkFBTSxFQUFDO1FBQ04sV0FBVyxFQUFFLHlDQUF5QztRQUN0RCxLQUFLLEVBQUUsR0FBRztRQUNWLElBQUksRUFBRSxTQUFTO1FBQ2YsT0FBTyxFQUFFLEtBQUs7S0FDZixDQUFDOzt5Q0FDWTtzQkFuRUgsV0FBVztJQUx2QixJQUFBLHlCQUFhLEVBQUM7UUFDYixPQUFPLEVBQUUsaUJBQWlCO1FBQzFCLFdBQVcsRUFBRSxjQUFjO1FBQzNCLEtBQUssRUFBRSxDQUFFLEdBQUcsQ0FBRTtLQUNmLENBQUM7R0FDVyxXQUFXLENBdU12QiJ9