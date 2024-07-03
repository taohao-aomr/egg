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
const path_1 = __importDefault(require("path"));
const chokidar_1 = __importDefault(require("chokidar"));
const assert_1 = __importDefault(require("assert"));
const events_1 = require("events");
const util_1 = require("util");
const utils = __importStar(require("./utils"));
const generator_1 = require("./generator");
const debug = (0, util_1.debuglog)('egg-ts-helper#watcher');
class Watcher extends events_1.EventEmitter {
    constructor(helper) {
        super();
        this.helper = helper;
        this.throttleTick = null;
        this.throttleStack = [];
        this.helper = helper;
    }
    init(options) {
        const generatorName = options.generator || 'class';
        this.config = this.helper.config;
        this.name = options.name;
        this.ref = options.ref;
        const generator = (0, generator_1.loadGenerator)(generatorName, { cwd: this.config.cwd });
        if (utils.isClass(generator)) {
            const instance = new generator(this.config, this.helper);
            this.generator = (config) => instance.render(config);
        }
        else {
            this.generator = generator;
        }
        options = this.options = {
            trigger: ['add', 'unlink'],
            generator: generatorName,
            pattern: '**/*.(ts|js)',
            watch: true,
            ...generator.defaultConfig,
            ...utils.cleanEmpty(options),
        };
        this.pattern = utils.toArray(this.options.pattern)
            .map(utils.formatPath)
            .concat(utils.toArray(this.options.ignore).map(p => `!${utils.formatPath(p)}`));
        (0, assert_1.default)(options.directory, `options.directory must set in ${generatorName}`);
        this.dir = path_1.default.resolve(this.config.cwd, options.directory);
        this.dtsDir = path_1.default.resolve(this.config.typings, path_1.default.relative(this.config.cwd, this.dir));
        // watch file change
        if (this.options.watch) {
            this.watch();
        }
        // exec at init
        if (this.options.execAtInit) {
            this.execute();
        }
    }
    destroy() {
        if (this.fsWatcher) {
            this.fsWatcher.close();
        }
        clearTimeout(this.throttleTick);
        this.throttleTick = null;
        this.throttleStack.length = 0;
        this.removeAllListeners();
    }
    // watch file change
    watch() {
        if (this.fsWatcher) {
            this.fsWatcher.close();
        }
        const watcherOption = {
            cwd: this.dir,
            ignoreInitial: true,
            ...(this.config.watchOptions || {}),
        };
        const watcher = chokidar_1.default.watch(this.pattern, watcherOption);
        // listen watcher event
        this.options.trigger.forEach(evt => {
            watcher.on(evt, this.onChange.bind(this));
        });
        // auto remove js while ts was deleted
        if (this.config.autoRemoveJs) {
            watcher.on('unlink', utils.removeSameNameJs);
        }
        this.fsWatcher = watcher;
    }
    // execute generator
    execute(file) {
        debug('execution %s', file);
        let _fileList;
        // use utils.extend to extend getter
        const newConfig = utils.extend({}, this.options, {
            file,
            dir: this.dir,
            dtsDir: this.dtsDir,
            pattern: this.pattern,
            get fileList() {
                return _fileList || (_fileList = utils.loadFiles(this.dir, this.pattern));
            },
        });
        const startTime = Date.now();
        const result = this.generator(newConfig, this.config, this.helper);
        if (result) {
            this.emit('update', result, file, startTime);
        }
        return result;
    }
    // on file change
    onChange(filePath) {
        filePath = path_1.default.resolve(this.dir, filePath);
        debug('file changed %s %o', filePath, this.throttleStack);
        if (!this.throttleStack.includes(filePath)) {
            this.throttleStack.push(filePath);
        }
        if (this.throttleTick) {
            return;
        }
        this.throttleTick = setTimeout(() => {
            while (this.throttleStack.length) {
                this.execute(this.throttleStack.pop());
            }
            this.throttleTick = null;
        }, this.config.throttle);
    }
}
exports.default = Watcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy93YXRjaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsd0RBQWdDO0FBQ2hDLG9EQUE0QjtBQUM1QixtQ0FBc0M7QUFDdEMsK0JBQWdDO0FBRWhDLCtDQUFpQztBQUNqQywyQ0FBNEM7QUFFNUMsTUFBTSxLQUFLLEdBQUcsSUFBQSxlQUFRLEVBQUMsdUJBQXVCLENBQUMsQ0FBQztBQW9CaEQsTUFBcUIsT0FBUSxTQUFRLHFCQUFZO0lBYS9DLFlBQW1CLE1BQWdCO1FBQ2pDLEtBQUssRUFBRSxDQUFDO1FBRFMsV0FBTSxHQUFOLE1BQU0sQ0FBVTtRQUhuQyxpQkFBWSxHQUFRLElBQUksQ0FBQztRQUN6QixrQkFBYSxHQUFhLEVBQUUsQ0FBQztRQUkzQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRU0sSUFBSSxDQUFDLE9BQXVCO1FBQ2pDLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDO1FBQ25ELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDakMsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUksQ0FBQztRQUV4QixNQUFNLFNBQVMsR0FBRyxJQUFBLHlCQUFhLEVBQUMsYUFBYSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUN6RSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDNUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENB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