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
exports.CovCommand = void 0;
const node_path_1 = __importDefault(require("node:path"));
const promises_1 = __importDefault(require("node:fs/promises"));
const artus_cli_1 = require("@artus-cli/artus-cli");
const test_1 = require("./test");
let CovCommand = class CovCommand extends test_1.TestCommand {
    // will use on egg-mock https://github.com/eggjs/egg-mock/blob/84a64bd19d0569ec94664c898fb1b28367b95d60/index.js#L7
    prerequire;
    x;
    c8;
    get defaultExcludes() {
        return [
            'example/',
            'examples/',
            'mocks**/',
            'docs/',
            // https://github.com/JaKXz/test-exclude/blob/620a7be412d4fc2070d50f0f63e3228314066fc9/index.js#L73
            'test/**',
            'test{,-*}.js',
            '**/*.test.js',
            '**/__tests__/**',
            '**/node_modules/**',
            'typings',
            '**/*.d.ts',
        ];
    }
    async forkNode(modulePath, args) {
        if (this.prerequire) {
            this.ctx.env.EGG_BIN_PREREQUIRE = 'true';
        }
        // append cobertura
        if (this.c8) {
            this.c8 += ' -r cobertura';
        }
        // add c8 args
        // https://github.com/eggjs/egg/issues/3930
        const c8Args = [
            // '--show-process-tree',
            ...this.c8.split(' ').filter(a => a.trim()),
        ];
        if (this.ctx.args.typescript) {
            this.ctx.env.SPAWN_WRAP_SHIM_ROOT = node_path_1.default.join(this.base, 'node_modules');
            c8Args.push('--extension');
            c8Args.push('.ts');
        }
        const excludes = new Set([
            ...process.env.COV_EXCLUDES?.split(',') ?? [],
            ...this.defaultExcludes,
            ...this.x,
        ]);
        for (const exclude of excludes) {
            c8Args.push('-x');
            c8Args.push(exclude);
        }
        const c8File = require.resolve('c8/bin/c8.js');
        const outputDir = node_path_1.default.join(this.base, 'node_modules/.c8_output');
        await promises_1.default.rm(outputDir, { force: true, recursive: true });
        const coverageDir = node_path_1.default.join(this.base, 'coverage');
        await promises_1.default.rm(coverageDir, { force: true, recursive: true });
        await super.forkNode(c8File, [...c8Args, process.execPath, ...this.ctx.args.execArgv || [], modulePath, ...args]);
    }
};
exports.CovCommand = CovCommand;
__decorate([
    (0, artus_cli_1.Option)({
        description: 'prerequire files for coverage instrument',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], CovCommand.prototype, "prerequire", void 0);
__decorate([
    (0, artus_cli_1.Option)({
        description: 'coverage ignore, one or more fileset patterns`',
        array: true,
        default: [],
    }),
    __metadata("design:type", Array)
], CovCommand.prototype, "x", void 0);
__decorate([
    (0, artus_cli_1.Option)({
        description: 'c8 instruments passthrough`',
        default: '--temp-directory node_modules/.c8_output -r text-summary -r json-summary -r json -r lcov -r cobertura',
    }),
    __metadata("design:type", String)
], CovCommand.prototype, "c8", void 0);
exports.CovCommand = CovCommand = __decorate([
    (0, artus_cli_1.DefineCommand)({
        command: 'cov [files...]',
        description: 'Run the test with coverage',
        alias: ['c'],
    })
], CovCommand);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY292LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NtZC9jb3YudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMERBQTZCO0FBQzdCLGdFQUFrQztBQUNsQyxvREFBNkQ7QUFDN0QsaUNBQXFDO0FBTzlCLElBQU0sVUFBVSxHQUFoQixNQUFNLFVBQVcsU0FBUSxrQkFBVztJQUN6QyxtSEFBbUg7SUFNbkgsVUFBVSxDQUFVO0lBT3BCLENBQUMsQ0FBVztJQU1aLEVBQUUsQ0FBUztJQUVYLElBQUksZUFBZTtRQUNqQixPQUFPO1lBQ0wsVUFBVTtZQUNWLFdBQVc7WUFDWCxVQUFVO1lBQ1YsT0FBTztZQUNQLG1HQUFtRztZQUNuRyxTQUFTO1lBQ1QsY0FBYztZQUNkLGNBQWM7WUFDZCxpQkFBaUI7WUFDakIsb0JBQW9CO1lBQ3BCLFNBQVM7WUFDVCxXQUFXO1NBQ1osQ0FBQztJQUNKLENBQUM7SUFFUyxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQWtCLEVBQUUsSUFBYztRQUN6RCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsR0FBRyxNQUFNLENBQUM7UUFDM0MsQ0FBQztRQUNELG1CQUFtQjtRQUNuQixJQUFJLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNaLElBQUksQ0FBQyxFQUFFLElBQUksZUFBZSxDQUFDO1FBQzdCLENBQUM7UUFFRCxjQUFjO1FBQ2QsMkNBQTJDO1FBQzNDLE1BQU0sTUFBTSxHQUFHO1lBQ2IseUJBQXlCO1lBQ3pCLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQzVDLENBQUM7UUFDRixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxD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