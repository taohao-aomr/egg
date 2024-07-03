"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.Context = void 0;
const tslib_1 = require("tslib");
require("reflect-metadata");
const core_1 = require("@artus/core");
const node_assert_1 = tslib_1.__importDefault(require("node:assert"));
const constant_1 = require("./constant");
const utils_1 = require("./utils");
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const fs_1 = tslib_1.__importDefault(require("fs"));
tslib_1.__exportStar(require("@artus/core"), exports);
var pipeline_1 = require("@artus/pipeline");
Object.defineProperty(exports, "Context", { enumerable: true, get: function () { return pipeline_1.Context; } });
tslib_1.__exportStar(require("./core/decorators"), exports);
tslib_1.__exportStar(require("./core/program"), exports);
tslib_1.__exportStar(require("./core/utils"), exports);
tslib_1.__exportStar(require("./core/bin_info"), exports);
tslib_1.__exportStar(require("./errors"), exports);
tslib_1.__exportStar(require("./types"), exports);
tslib_1.__exportStar(require("./core/command"), exports);
tslib_1.__exportStar(require("./core/context"), exports);
tslib_1.__exportStar(require("./core/parsed_commands"), exports);
tslib_1.__exportStar(require("./core/parsed_command"), exports);
tslib_1.__exportStar(require("./core/parsed_command_tree"), exports);
async function start(options = {}) {
    if (process.env.ARTUS_CLI_SCANNING) {
        // avoid scan bin file and start again
        return null;
    }
    // try to read baseDir by callee stack
    const calleeFile = (0, utils_1.getCalleeFile)(2);
    const findPkgDir = options.baseDir || (calleeFile && node_path_1.default.dirname(calleeFile));
    (0, node_assert_1.default)(findPkgDir, 'Can not detect baseDir, failed to load package.json');
    const { pkgInfo, pkgPath } = await (0, utils_1.readPkg)(findPkgDir);
    const baseDir = options.baseDir || node_path_1.default.dirname(pkgPath);
    // auto use package.json bin
    if (!options.binName && pkgInfo.bin && typeof pkgInfo.bin === 'object') {
        options.binName = Object.keys(pkgInfo.bin)[0];
    }
    let manifest;
    const manifestCachePath = node_path_1.default.resolve(baseDir, 'manifest.json');
    if (options.useManifestCache && fs_1.default.existsSync(manifestCachePath)) {
        try {
            manifest = require(manifestCachePath);
        }
        catch (e) {
            // do nothing
        }
    }
    if (!manifest) {
        // record scanning state
        process.env.ARTUS_CLI_SCANNING = 'true';
        const exclude = options.exclude || ['bin', 'test', 'coverage'];
        if (calleeFile) {
            const isBuildJavascriptFile = calleeFile.endsWith('.js');
            if (isBuildJavascriptFile) {
                exclude.push('*.ts');
            }
            else {
                exclude.push('dist');
            }
        }
        // scan app files
        const scanner = new core_1.Scanner({
            needWriteFile: false,
            configDir: 'config',
            extensions: ['.ts'],
            framework: options.framework || { path: __dirname },
            exclude,
        });
        manifest = await scanner.scan(baseDir);
        // save manifest to local
        if (options.useManifestCache) {
            fs_1.default.writeFileSync(manifestCachePath, JSON.stringify(manifest));
        }
        delete process.env.ARTUS_CLI_SCANNING;
    }
    if (process.env.ARTUS_CLI_PRELOAD !== 'true') {
        // start app
        const artusEnv = options.artusEnv || process.env.ARTUS_CLI_ENV || 'default';
        const app = new core_1.ArtusApplication();
        (0, node_assert_1.default)(manifest[artusEnv], `Unknown env "${artusEnv}"`);
        // bin opt store in app
        app[constant_1.BIN_OPTION_SYMBOL] = Object.assign(Object.assign({}, options), { pkgInfo, artusEnv, baseDir });
        await app.load(manifest[artusEnv], baseDir);
        await app.run();
        return app;
    }
    return null;
}
exports.start = start;
