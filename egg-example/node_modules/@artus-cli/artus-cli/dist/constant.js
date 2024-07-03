"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BIN_OPTION_SYMBOL = exports.EXCUTION_SYMBOL = exports.CONTEXT_SYMBOL = exports.OptionInjectType = exports.MetadataEnum = void 0;
var MetadataEnum;
(function (MetadataEnum) {
    MetadataEnum["COMMAND"] = "COMMAND_METADATA";
    MetadataEnum["OPTION"] = "OPTION_METADATA";
    MetadataEnum["MIDDLEWARE"] = "MIDDLEWARE_METADATA";
    MetadataEnum["RUN_MIDDLEWARE"] = "RUN_MIDDLEWARE_METADATA";
})(MetadataEnum = exports.MetadataEnum || (exports.MetadataEnum = {}));
var OptionInjectType;
(function (OptionInjectType) {
    OptionInjectType[OptionInjectType["KEY_OPTION"] = 0] = "KEY_OPTION";
    OptionInjectType[OptionInjectType["FULL_OPTION"] = 1] = "FULL_OPTION";
})(OptionInjectType = exports.OptionInjectType || (exports.OptionInjectType = {}));
exports.CONTEXT_SYMBOL = Symbol('Command#Context');
exports.EXCUTION_SYMBOL = Symbol('Command#Excution');
exports.BIN_OPTION_SYMBOL = Symbol('BinInfo#Option');
