"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorator_1 = require("../decorator");
const load_meta_file_1 = require("../../utils/load_meta_file");
const constant_1 = require("../../constant");
const utils_1 = require("../../utils");
const exception_1 = require("../../exception");
let ExceptionLoader = class ExceptionLoader {
    static async is(opts) {
        return (0, utils_1.isMatch)(opts.filename, constant_1.EXCEPTION_FILENAME);
    }
    async load(item) {
        try {
            const codeMap = await (0, load_meta_file_1.loadMetaFile)(item.path);
            for (const [errCode, exceptionItem] of Object.entries(codeMap)) {
                exception_1.ArtusStdError.registerCode(errCode, exceptionItem);
            }
            return codeMap;
        }
        catch (error) {
            console.warn(`[Artus-Exception] Parse CodeMap ${item.path} failed: ${error.message}`);
            return void 0;
        }
    }
};
ExceptionLoader = tslib_1.__decorate([
    (0, decorator_1.DefineLoader)('exception')
], ExceptionLoader);
exports.default = ExceptionLoader;
