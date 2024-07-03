"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinInfo = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@artus/core");
const constant_1 = require("../constant");
let BinInfo = class BinInfo {
    constructor(app) {
        const opt = app[constant_1.BIN_OPTION_SYMBOL];
        this.name = opt.pkgInfo.name || '';
        this.artusEnv = opt.artusEnv;
        this.version = opt.pkgInfo.version || '';
        // bin can be options.binName or pkg.name
        this.binName = opt.binName || app.config.binName || opt.pkgInfo.name;
        this.baseDir = opt.baseDir;
        this.author = opt.pkgInfo.author || '';
        this.description = opt.pkgInfo.description || '';
        this.pkgInfo = opt.pkgInfo;
        const config = app.config;
        this.inheritMetadata = !!config.inheritMetadata;
        const getBool = (...args) => args.find(a => typeof a === 'boolean');
        this.strict = getBool(opt.strict, config.strict);
        this.strictCommands = getBool(opt.strictCommands, config.strictCommands, this.strict);
        this.strictOptions = getBool(opt.strictOptions, config.strictOptions, this.strict);
        delete app[constant_1.BIN_OPTION_SYMBOL];
    }
};
BinInfo = tslib_1.__decorate([
    (0, core_1.Injectable)({ scope: core_1.ScopeEnum.SINGLETON }),
    tslib_1.__param(0, (0, core_1.Inject)(core_1.ArtusInjectEnum.Application)),
    tslib_1.__metadata("design:paramtypes", [core_1.ArtusApplication])
], BinInfo);
exports.BinInfo = BinInfo;
