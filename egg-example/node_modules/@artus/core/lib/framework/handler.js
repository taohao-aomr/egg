"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrameworkHandler = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const configuration_1 = tslib_1.__importDefault(require("../configuration"));
class FrameworkHandler {
    static async mergeConfig(env, frameworks, done) {
        frameworks = frameworks.filter(item => !done.includes(item.path));
        const frameworkConfigHandler = new configuration_1.default();
        for (const frameworkConfigFile of frameworks) {
            await frameworkConfigHandler.setConfigByFile(frameworkConfigFile);
        }
        done = done.concat(frameworks.map(item => item.path));
        return { config: frameworkConfigHandler.getMergedConfig(env), done };
    }
    static async handle(root, config) {
        var _a, _b;
        // no framework
        if (!config.path && !config.package) {
            return '';
        }
        try {
            const baseFrameworkPath = (_a = config.path) !== null && _a !== void 0 ? _a : path_1.default.dirname(require.resolve((_b = config.package) !== null && _b !== void 0 ? _b : '', { paths: [root] }));
            return baseFrameworkPath;
        }
        catch (err) {
            throw new Error(`load framework faild: ${err}, framework config: ${JSON.stringify(config)}`);
        }
    }
}
exports.FrameworkHandler = FrameworkHandler;
