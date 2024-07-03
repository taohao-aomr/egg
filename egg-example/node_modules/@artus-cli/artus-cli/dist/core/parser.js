"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCommand = exports.parseArgvWithPositional = exports.parseArgvToArgs = exports.parseArgvKeySimple = void 0;
const tslib_1 = require("tslib");
const yargs_parser_1 = tslib_1.__importDefault(require("yargs-parser"));
const utils_1 = require("../utils");
const lodash_1 = require("lodash");
const errors_1 = require("../errors");
/** convert argv to camelCase key simpliy */
function parseArgvKeySimple(argv) {
    const list = (0, lodash_1.flatten)((Array.isArray(argv) ? argv : [argv]).map(arg => arg.split(/\s+/)));
    const newList = [];
    for (const arg of list) {
        if (arg === '--')
            break;
        if (!arg.match(/^\-+[^\-]/i))
            continue;
        const raw = arg.split('=')[0];
        newList.push({ raw, parsed: yargs_parser_1.default.camelCase(raw.replace(/^\-{2}no\-/, '')) });
    }
    return newList;
}
exports.parseArgvKeySimple = parseArgvKeySimple;
/** parse argv to args, base on yargs-parser */
function parseArgvToArgs(argv, option = {}) {
    const requiredOptions = [];
    const parserOption = {
        configuration: { "populate--": true },
    };
    if (option.optionConfig) {
        for (const key in option.optionConfig) {
            const opt = option.optionConfig[key];
            if (opt.required)
                requiredOptions.push(key);
            if (!(0, utils_1.isNil)(opt.alias)) {
                parserOption.alias = parserOption.alias || {};
                parserOption.alias[key] = opt.alias;
            }
            if (!(0, utils_1.isNil)(opt.type)) {
                parserOption[opt.type] = parserOption[opt.type] || [];
                parserOption[opt.type].push(key);
            }
            if (!(0, utils_1.isNil)(opt.default)) {
                parserOption.default = parserOption.default || {};
                parserOption.default[key] = opt.default;
            }
            if (!(0, utils_1.isNil)(opt.array)) {
                parserOption.array = parserOption.array || [];
                parserOption.array.push(key);
            }
        }
    }
    const parseResult = yargs_parser_1.default.detailed(argv, parserOption);
    let error;
    const requiredNilOptions = requiredOptions.filter(k => (0, utils_1.isNil)(parseResult.argv[k]));
    if (requiredNilOptions.length) {
        // check required option
        error = errors_1.errors.required_options(requiredNilOptions);
    }
    else if (option.optionConfig && option.strictOptions) {
        // checking for strict options
        const argvs = parseArgvKeySimple(argv);
        const notSupportArgvs = new Set();
        Object.keys(parseResult.argv).forEach(key => {
            var _a;
            // _ and -- is built-in key
            if (key === '_' || key === '--')
                return;
            // checking with alias list
            const alias = (parseResult.aliases[key] || []).concat(key);
            if (alias.every(n => !notSupportArgvs.has(n) && !option.optionConfig[n])) {
                const flag = (_a = argvs.find(a => a.parsed === key || a.raw === key)) === null || _a === void 0 ? void 0 : _a.raw;
                if (flag)
                    notSupportArgvs.add(flag);
            }
        });
        // check unknown by yargs-parser
        argvs.forEach(a => {
            if (parseResult.argv[a.parsed] === undefined)
                notSupportArgvs.add(a.raw);
        });
        if (notSupportArgvs.size) {
            error = errors_1.errors.unknown_options(Array.from(notSupportArgvs));
        }
    }
    else if (parseResult.error) {
        error = errors_1.errors.unknown(parseResult.error.message);
    }
    return {
        args: parseResult.argv,
        error,
    };
}
exports.parseArgvToArgs = parseArgvToArgs;
/** parse `<options>` or `[option]` and collect args */
function parseArgvWithPositional(argv, pos, options) {
    let nextIndex = pos.length;
    const result = {};
    const unmatchPositionals = pos.filter((positional, index) => {
        // `bin <files..>` match `bin file1 file2 file3` => { files: [ "file1", "file2", "file3" ] }
        // `bin <file> [baseDir]` match `bin file1 ./` => { file: "file1", baseDir: "./" }
        let r;
        if (positional.variadic) {
            r = argv.slice(index);
            nextIndex = argv.length; // variadic means the last
        }
        else {
            r = argv[index];
        }
        // check arguments option
        const argOpt = options ? options[positional.cmd] : undefined;
        if (argOpt) {
            r = (0, utils_1.isNil)(r) ? argOpt.default : r;
            if (argOpt.type)
                r = (0, utils_1.convertValue)(r, argOpt.type);
        }
        result[positional.cmd] = r;
        return (0, utils_1.isNil)(r);
    });
    return {
        result,
        unknownArgv: argv.slice(nextIndex),
        unmatchPositionals,
    };
}
exports.parseArgvWithPositional = parseArgvWithPositional;
/** parse command string to struct */
function parseCommand(cmd, binName) {
    const extraSpacesStrippedCommand = cmd.replace(/\s{2,}/g, ' ');
    const splitCommand = extraSpacesStrippedCommand.split(/\s+(?![^[]*]|[^<]*>)/);
    const bregex = /\.*[\][<>]\.*/g;
    if (!splitCommand.length)
        throw new Error(`No command found in: ${cmd}`);
    if (splitCommand[0] === binName)
        splitCommand.shift();
    let command;
    if (!splitCommand[0] || splitCommand[0].match(bregex)) {
        command = [binName, ...splitCommand].join(' ');
    }
    else {
        command = splitCommand.join(' ');
    }
    const parsedCommand = {
        uid: '',
        cmd: '',
        cmds: [binName],
        command,
        demanded: [],
        optional: [],
    };
    splitCommand.forEach((cmd, i) => {
        let variadic = false;
        cmd = cmd.replace(/\s/g, '');
        // <file...> or [file...]
        if (i === splitCommand.length - 1 && /(\.+[\]>])|([\[<]\.+)/.test(cmd))
            variadic = true;
        const result = cmd.match(/^(\[|\<)/);
        if (result) {
            if (result[1] === '[') {
                // [options]
                parsedCommand.optional.push({ cmd: cmd.replace(bregex, ''), variadic });
            }
            else {
                // <options>
                parsedCommand.demanded.push({ cmd: cmd.replace(bregex, ''), variadic });
            }
        }
        else {
            // command without [] or <>
            parsedCommand.cmds.push(cmd);
        }
    });
    // last cmd is the command
    parsedCommand.cmd = parsedCommand.cmds[parsedCommand.cmds.length - 1];
    parsedCommand.uid = parsedCommand.cmds.join(' ');
    return parsedCommand;
}
exports.parseCommand = parseCommand;
