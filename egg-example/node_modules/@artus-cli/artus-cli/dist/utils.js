"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDesc = exports.formatCmd = exports.formatToArray = exports.getCalleeDir = exports.getCalleeFile = exports.getCalleeList = exports.readPkg = exports.convertValue = exports.isNil = exports.checkCommandCompatible = exports.isInheritFrom = void 0;
const tslib_1 = require("tslib");
const pkg_up_1 = tslib_1.__importDefault(require("pkg-up"));
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const node_assert_1 = tslib_1.__importDefault(require("node:assert"));
function isInheritFrom(clz, maybeParent) {
    if (clz === maybeParent)
        return true;
    let curr = clz;
    while (curr) {
        if (curr === maybeParent)
            return true;
        curr = Object.getPrototypeOf(curr);
    }
    return false;
}
exports.isInheritFrom = isInheritFrom;
function checkCommandCompatible(command, compareCommand) {
    // check option
    for (const key in command.options) {
        const item = command.options[key];
        const compareItem = compareCommand.options[key];
        if (!compareItem)
            return false;
        if (item.type !== compareItem.type)
            return false;
    }
    // check demanded/optional
    const flattern = (pos) => pos.map(d => d.cmd).join(' ');
    if (flattern(command.demanded) !== flattern(compareCommand.demanded))
        return false;
    if (flattern(command.optional) !== flattern(compareCommand.optional))
        return false;
    return true;
}
exports.checkCommandCompatible = checkCommandCompatible;
function isNil(v) {
    return v === undefined || v === null;
}
exports.isNil = isNil;
function convertValue(val, type) {
    if (Array.isArray(val))
        return val.map(v => convertValue(v, type));
    switch (type) {
        case 'number': return +val;
        case 'boolean': return val === 'false' ? false : !!val;
        default: return val;
    }
}
exports.convertValue = convertValue;
async function readPkg(baseDir) {
    const pkgPath = await (0, pkg_up_1.default)({ cwd: baseDir });
    (0, node_assert_1.default)(pkgPath, `Can not find package.json in ${baseDir}`);
    return {
        pkgPath,
        pkgInfo: require(pkgPath),
    };
}
exports.readPkg = readPkg;
function getCalleeList(traceLimit) {
    const limit = Error.stackTraceLimit;
    const prep = Error.prepareStackTrace;
    Error.prepareStackTrace = prepareObjectStackTrace;
    Error.stackTraceLimit = traceLimit;
    const obj = {};
    Error.captureStackTrace(obj);
    const stack = obj.stack;
    Error.prepareStackTrace = prep;
    Error.stackTraceLimit = limit;
    return stack.map(s => ({
        methodName: s.getMethodName(),
        fileName: s.getFileName(),
    }));
}
exports.getCalleeList = getCalleeList;
function getCalleeFile(stackIndex) {
    var _a;
    stackIndex++; // one more stack
    const calleeList = getCalleeList(stackIndex + 1);
    const calleeFile = (_a = calleeList[stackIndex]) === null || _a === void 0 ? void 0 : _a.fileName;
    return calleeFile;
}
exports.getCalleeFile = getCalleeFile;
function getCalleeDir(stackIndex) {
    const calleeFile = getCalleeFile(stackIndex + 1);
    return calleeFile ? node_path_1.default.dirname(calleeFile) : undefined;
}
exports.getCalleeDir = getCalleeDir;
function prepareObjectStackTrace(_obj, stack) {
    return stack;
}
function formatToArray(input) {
    return input
        ? Array.isArray(input)
            ? input
            : [input]
        : [];
}
exports.formatToArray = formatToArray;
function formatCmd(cmd, obj, prefix) {
    cmd = formatDesc(cmd.trim().replace(/^\$0( |$)/, `${obj.$0}$1`), obj);
    if (prefix) {
        if (cmd.startsWith(obj.$0)) {
            return `${prefix} ${cmd.substring(obj.$0.length).trim()}`;
        }
        else {
            return `${prefix} ${cmd}`;
        }
    }
    return cmd || obj.$0;
}
exports.formatCmd = formatCmd;
function formatDesc(info, obj) {
    return info.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => obj[key]);
}
exports.formatDesc = formatDesc;
