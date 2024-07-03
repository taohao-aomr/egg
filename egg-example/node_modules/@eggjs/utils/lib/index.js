"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFrameworkOrEggPath = exports.getLoadUnits = exports.getConfig = exports.getPlugins = exports.getFrameworkPath = void 0;
const framework_1 = require("./framework");
const plugin_1 = require("./plugin");
const deprecated_1 = require("./deprecated");
// support import { getFrameworkPath } from '@eggjs/utils'
var framework_2 = require("./framework");
Object.defineProperty(exports, "getFrameworkPath", { enumerable: true, get: function () { return framework_2.getFrameworkPath; } });
var plugin_2 = require("./plugin");
Object.defineProperty(exports, "getPlugins", { enumerable: true, get: function () { return plugin_2.getPlugins; } });
Object.defineProperty(exports, "getConfig", { enumerable: true, get: function () { return plugin_2.getConfig; } });
Object.defineProperty(exports, "getLoadUnits", { enumerable: true, get: function () { return plugin_2.getLoadUnits; } });
var deprecated_2 = require("./deprecated");
Object.defineProperty(exports, "getFrameworkOrEggPath", { enumerable: true, get: function () { return deprecated_2.getFrameworkOrEggPath; } });
// support import utils from '@eggjs/utils'
exports.default = {
    getFrameworkPath: framework_1.getFrameworkPath,
    getPlugins: plugin_1.getPlugins, getConfig: plugin_1.getConfig, getLoadUnits: plugin_1.getLoadUnits,
    getFrameworkOrEggPath: deprecated_1.getFrameworkOrEggPath,
};
