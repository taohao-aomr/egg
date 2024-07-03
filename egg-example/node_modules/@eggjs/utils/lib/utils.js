"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readJSONSync = void 0;
const node_fs_1 = require("node:fs");
function readJSONSync(file) {
    if (!(0, node_fs_1.existsSync)(file)) {
        throw new Error(`${file} is not found`);
    }
    return JSON.parse((0, node_fs_1.readFileSync)(file, 'utf-8'));
}
exports.readJSONSync = readJSONSync;
