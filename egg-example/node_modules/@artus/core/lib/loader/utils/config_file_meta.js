"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigMetaFromFilename = void 0;
const constant_1 = require("../../constant");
const getConfigMetaFromFilename = (filename) => {
    let [namespace, env, extname] = filename.split('.');
    if (!extname) {
        // No env flag, set to Default
        env = constant_1.ARTUS_DEFAULT_CONFIG_ENV.DEFAULT;
    }
    const meta = {
        env,
    };
    if (namespace !== 'config') {
        meta.namespace = namespace;
    }
    return meta;
};
exports.getConfigMetaFromFilename = getConfigMetaFromFilename;
