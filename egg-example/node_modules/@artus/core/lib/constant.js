"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHOULD_OVERWRITE_VALUE = exports.DEFAULT_CONFIG_DIR = exports.DEFAULT_LOADER_LIST_WITH_ORDER = exports.EXCEPTION_FILENAME = exports.PLUGIN_META_FILENAME = exports.PACKAGE_JSON = exports.PLUGIN_CONFIG_PATTERN = exports.FRAMEWORK_PATTERN = exports.DEFAULT_EXCLUDES = exports.HOOK_CONFIG_HANDLE = exports.HOOK_FILE_LOADER = exports.HOOK_NAME_META_PREFIX = exports.ARTUS_SERVER_ENV = exports.ARTUS_EXCEPTION_DEFAULT_LOCALE = exports.ScanPolicy = exports.ARTUS_DEFAULT_CONFIG_ENV = exports.ArtusInjectEnum = exports.ArtusInjectPrefix = exports.LOADER_NAME_META = exports.DEFAULT_LOADER = void 0;
exports.DEFAULT_LOADER = 'module';
exports.LOADER_NAME_META = 'loader:name';
exports.ArtusInjectPrefix = 'artus#';
var ArtusInjectEnum;
(function (ArtusInjectEnum) {
    ArtusInjectEnum["Application"] = "artus#application";
    ArtusInjectEnum["Config"] = "artus#config";
    ArtusInjectEnum["DefaultContainerName"] = "artus#default_container";
    ArtusInjectEnum["Frameworks"] = "artus#framework-config";
    ArtusInjectEnum["LifecycleManager"] = "artus#lifecycle-manager";
    ArtusInjectEnum["Packages"] = "artus#packages";
})(ArtusInjectEnum = exports.ArtusInjectEnum || (exports.ArtusInjectEnum = {}));
var ARTUS_DEFAULT_CONFIG_ENV;
(function (ARTUS_DEFAULT_CONFIG_ENV) {
    ARTUS_DEFAULT_CONFIG_ENV["DEV"] = "development";
    ARTUS_DEFAULT_CONFIG_ENV["PROD"] = "production";
    ARTUS_DEFAULT_CONFIG_ENV["DEFAULT"] = "default";
})(ARTUS_DEFAULT_CONFIG_ENV = exports.ARTUS_DEFAULT_CONFIG_ENV || (exports.ARTUS_DEFAULT_CONFIG_ENV = {}));
var ScanPolicy;
(function (ScanPolicy) {
    ScanPolicy["NamedExport"] = "named_export";
    ScanPolicy["DefaultExport"] = "default_export";
    ScanPolicy["All"] = "all";
})(ScanPolicy = exports.ScanPolicy || (exports.ScanPolicy = {}));
exports.ARTUS_EXCEPTION_DEFAULT_LOCALE = 'en';
exports.ARTUS_SERVER_ENV = 'ARTUS_SERVER_ENV';
exports.HOOK_NAME_META_PREFIX = 'hookName:';
exports.HOOK_FILE_LOADER = 'appHook:fileLoader';
exports.HOOK_CONFIG_HANDLE = 'appHook:configHandle::';
exports.DEFAULT_EXCLUDES = [
    'test',
    'node_modules',
    '.*',
    'tsconfig*.json',
    '*.d.ts',
    'jest.config.*',
    'meta.json',
    'LICENSE',
    'pnpm-lock.yaml',
];
exports.FRAMEWORK_PATTERN = 'framework.*';
exports.PLUGIN_CONFIG_PATTERN = 'plugin.*';
exports.PACKAGE_JSON = 'package.json';
exports.PLUGIN_META_FILENAME = 'meta.json';
exports.EXCEPTION_FILENAME = 'exception.json';
exports.DEFAULT_LOADER_LIST_WITH_ORDER = [
    'exception',
    'exception-filter',
    'plugin-meta',
    'framework-config',
    'package-json',
    'module',
    'lifecycle-hook-unit',
    'config',
];
exports.DEFAULT_CONFIG_DIR = 'src/config';
exports.SHOULD_OVERWRITE_VALUE = 'shouldOverwrite';
