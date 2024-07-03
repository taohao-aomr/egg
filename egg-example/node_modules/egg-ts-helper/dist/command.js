"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const path_1 = __importDefault(require("path"));
const commander_1 = require("commander");
Object.defineProperty(exports, "Command", { enumerable: true, get: function () { return commander_1.Command; } });
const assert_1 = __importDefault(require("assert"));
const core_1 = __importStar(require("./core"));
const utils_1 = require("./utils");
class Commander {
    constructor(options) {
        this.commands = (0, utils_1.loadModules)(path_1.default.resolve(__dirname, './cmd'), true);
        this.tsHelperClazz = options?.tsHelperClazz || core_1.default;
        let version = options?.version;
        if (!version) {
            version = (0, utils_1.getPkgInfo)(path_1.default.dirname(__dirname)).version;
        }
        this.program = new commander_1.Command()
            .version(version, '-v, --version')
            .usage('[commands] [options]')
            .option('-w, --watch', 'Watching files, d.ts would recreated while file changed')
            .option('-c, --cwd [path]', 'Egg application base dir (default: process.cwd)')
            .option('-C, --config [path]', 'Configuration file, The argument can be a file path to a valid JSON/JS configuration file.（default: {cwd}/tshelper.js')
            .option('-f, --framework [name]', 'Egg framework(default: egg)')
            .option('-o, --oneForAll [path]', 'Create a d.ts import all types (default: typings/ets.d.ts)')
            .option('-s, --silent', 'Running without output')
            .option('-i, --ignore [dirs]', 'Ignore watchDirs, your can ignore multiple dirs with comma like: -i controller,service')
            .option('-e, --enabled [dirs]', 'Enable watchDirs, your can enable multiple dirs with comma like: -e proxy,other')
            .option('-E, --extra [json]', 'Extra config, the value should be json string');
    }
    init(argv) {
        const { program, commands } = this;
        let executeCmd;
        // override executeSubCommand to support async subcommand.
        program.addImplicitHelpCommand = () => { };
        program.executeSubCommand = async function (argv, args, unknown) {
            const cwd = this.cwd || core_1.defaultConfig.cwd;
            const command = commands[executeCmd];
            (0, assert_1.default)(command, executeCmd + ' does not exist');
            await command.run(this, { cwd, argv, args: args.filter(item => item !== this), unknown });
        };
        if (!argv.slice(2).length) {
            this.execute();
        }
        else {
            Object.keys(commands).forEach(cmd => {
                const subCommand = commands[cmd];
                const cmdName = subCommand.options ? `${cmd} ${subCommand.options}` : cmd;
                program.command(cmdName, subCommand.description)
                    .action(command => executeCmd = command);
            });
            program.parse(argv);
            if (!executeCmd) {
                this.execute();
            }
        }
    }
    execute() {
        const { program } = this;
        const watchFiles = program.watch;
        const generatorConfig = {};
        program.ignore && program.ignore.split(',').forEach(key => (generatorConfig[key] = false));
        program.enabled && program.enabled.split(',').forEach(key => (generatorConfig[key] = true));
        const tsHelperConfig = {
            cwd: program.cwd || core_1.defaultConfig.cwd,
            framework: program.framework,
            watch: watchFiles,
            generatorConfig,
            configFile: program.config,
            ...(program.extra ? JSON.parse(program.extra) : {}),
        };
        // silent
        if (program.silent) {
            tsHelperConfig.silent = true;
        }
        if ((0, utils_1.checkMaybeIsJsProj)(tsHelperConfig.cwd)) {
            // write jsconfig if the project is wrote by js
            (0, utils_1.writeJsConfig)(tsHelperConfig.cwd);
        }
        // create instance
        const clazz = this.tsHelperClazz;
        const tsHelper = new clazz(tsHelperConfig).build();
        if (program.oneForAll) {
            // create one for all
            tsHelper.createOneForAll(program.oneForAll);
        }
    }
}
exports.default = Commander;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21tYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsZ0RBQXdCO0FBQ3hCLHlDQUFvQztBQXdHM0Isd0ZBeEdBLG1CQUFPLE9Bd0dBO0FBdkdoQixvREFBNEI7QUFDNUIsK0NBQWlEO0FBQ2pELG1DQUFxRjtBQU9yRixNQUFxQixTQUFTO0lBSzVCLFlBQVksT0FBdUI7UUFDakMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFBLG1CQUFXLEVBQWEsY0FBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEYsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLEVBQUUsYUFBYSxJQUFJLGNBQVEsQ0FBQztRQUN4RCxJQUFJLE9BQU8sR0FBRyxPQUFPLEVBQUUsT0FBTyxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLEdBQUcsSUFBQSxrQkFBVSxFQUFDLGNBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7U0FDdkQ7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksbUJBQU8sRUFBRTthQUN6QixPQUFPLENBQUMsT0FBUSxFQUFFLGVBQWUsQ0FBQzthQUNsQyxLQUFLLENBQUMsc0JBQXNCLENBQUM7YUFDN0IsTUFBTSxDQUFDLGFBQWEsRUFBRSx5REFBeUQsQ0FBQzthQUNoRixNQUFNLENBQUMsa0JBQWtCLEVBQUUsaURBQWlELENBQUM7YUFDN0UsTUFBTSxDQUFDLHFCQUFxQixFQUFFLHVIQUF1SCxDQUFDO2FBQ3RKLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSw2QkFBNkIsQ0FBQzthQUMvRCxNQUFNLENBQUMsd0JBQXdCLEVBQUUsNERBQTRELENBQUM7YUFDOUYsTUFBTSxDQUFDLGNBQWMsRUFBRSx3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