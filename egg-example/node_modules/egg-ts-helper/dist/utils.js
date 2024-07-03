"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanEmpty = exports.modifierHas = exports.isClass = exports.findExportNode = exports.loadTsConfig = exports.camelProp = exports.formatProp = exports.readJson5 = exports.readJson = exports.getPkgInfo = exports.parseJson = exports.extend = exports.requireFile = exports.moduleExist = exports.resolveModule = exports.removeSameNameJs = exports.toArray = exports.formatPath = exports.getModuleObjByPath = exports.cleanJs = exports.writeFileSync = exports.getImportStr = exports.log = exports.pickFields = exports.strToFn = exports.loadModules = exports.checkMaybeIsJsProj = exports.checkMaybeIsTsProj = exports.writeTsConfig = exports.writeJsConfig = exports.loadFiles = exports.isIdentifierName = exports.convertString = exports.getEggInfo = exports.TS_CONFIG = exports.JS_CONFIG = void 0;
const fs_1 = __importDefault(require("fs"));
const globby_1 = __importDefault(require("globby"));
const path_1 = __importDefault(require("path"));
const typescript_1 = __importDefault(require("typescript"));
const yn_1 = __importDefault(require("yn"));
const child_process_1 = require("child_process");
const json5_1 = __importDefault(require("json5"));
const config_1 = require("./config");
exports.JS_CONFIG = {
    include: ['**/*'],
};
exports.TS_CONFIG = {
    compilerOptions: {
        target: typescript_1.default.ScriptTarget.ES2017,
        module: typescript_1.default.ModuleKind.CommonJS,
        strict: true,
        noImplicitAny: false,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        allowSyntheticDefaultImports: true,
        allowJs: false,
        pretty: true,
        lib: ['es6'],
        noEmitOnError: false,
        noUnusedLocals: true,
        noUnusedParameters: true,
        allowUnreachableCode: false,
        allowUnusedLabels: false,
        strictPropertyInitialization: false,
        noFallthroughCasesInSwitch: true,
        skipLibCheck: true,
        skipDefaultLibCheck: true,
        inlineSourceMap: true,
    },
};
const cacheEggInfo = {};
function getEggInfo(option) {
    const { cacheIndex, cwd, customLoader } = option;
    const cacheKey = cacheIndex ? `${cacheIndex}${cwd}` : undefined;
    const caches = cacheKey ? (cacheEggInfo[cacheKey] = cacheEggInfo[cacheKey] || {}) : undefined;
    const end = (json) => {
        if (caches) {
            caches.eggInfo = json;
            caches.cacheTime = Date.now();
        }
        if (option.callback) {
            return option.callback(json);
        }
        return json;
    };
    // check cache
    if (caches) {
        if (caches.cacheTime && (Date.now() - caches.cacheTime) < 1000) {
            return end(caches.eggInfo);
        }
        else if (caches.runningPromise) {
            return caches.runningPromise;
        }
    }
    // get egg info from customLoader
    if (customLoader) {
        return end({
            config: customLoader.config,
            plugins: customLoader.plugins,
            eggPaths: customLoader.eggPaths,
        });
    }
    // prepare options
    const cmd = 'node';
    const args = [path_1.default.resolve(__dirname, './scripts/eggInfo')];
    const opt = {
        cwd,
        env: {
            ...process.env,
            TS_NODE_TYPE_CHECK: 'false',
            TS_NODE_TRANSPILE_ONLY: 'true',
            TS_NODE_FILES: 'false',
            EGG_TYPESCRIPT: 'true',
            CACHE_REQUIRE_PATHS_FILE: path_1.default.resolve(config_1.tmpDir, './requirePaths.json'),
            ...option.env,
        },
    };
    if (option.async) {
        // cache promise
        caches.runningPromise = new Promise((resolve, reject) => {
            (0, child_process_1.execFile)(cmd, args, opt, err => {
                caches.runningPromise = null;
                if (err)
                    reject(err);
                resolve(end(parseJson(fs_1.default.readFileSync(config_1.eggInfoPath, 'utf-8'))));
            });
        });
        return caches.runningPromise;
    }
    try {
        (0, child_process_1.execFileSync)(cmd, args, opt);
        return end(parseJson(fs_1.default.readFileSync(config_1.eggInfoPath, 'utf-8')));
    }
    catch (e) {
        return end({});
    }
}
exports.getEggInfo = getEggInfo;
// convert string to same type with default value
function convertString(val, defaultVal) {
    if (val === undefined)
        return defaultVal;
    switch (typeof defaultVal) {
        case 'boolean':
            return (0, yn_1.default)(val, { default: defaultVal });
        case 'number':
            const num = +val;
            return (isNaN(num) ? defaultVal : num);
        case 'string':
            return val;
        default:
            return defaultVal;
    }
}
exports.convertString = convertString;
function isIdentifierName(s) {
    return /^[$A-Z_][0-9A-Z_$]*$/i.test(s);
}
exports.isIdentifierName = isIdentifierName;
// load ts/js files
function loadFiles(cwd, pattern) {
    pattern = pattern || '**/*.(js|ts)';
    pattern = Array.isArray(pattern) ? pattern : [pattern];
    const fileList = globby_1.default.sync(pattern.concat(['!**/*.d.ts']), { cwd });
    return fileList.filter(f => {
        // filter same name js/ts
        return !(f.endsWith('.js') &&
            fileList.includes(f.substring(0, f.length - 2) + 'ts'));
    });
}
exports.loadFiles = loadFiles;
// write jsconfig.json to cwd
function writeJsConfig(cwd) {
    const jsconfigUrl = path_1.default.resolve(cwd, './jsconfig.json');
    if (!fs_1.default.existsSync(jsconfigUrl)) {
        fs_1.default.writeFileSync(jsconfigUrl, JSON.stringify(exports.JS_CONFIG, null, 2));
        return jsconfigUrl;
    }
}
exports.writeJsConfig = writeJsConfig;
// write tsconfig.json to cwd
function writeTsConfig(cwd) {
    const tsconfigUrl = path_1.default.resolve(cwd, './tsconfig.json');
    if (!fs_1.default.existsSync(tsconfigUrl)) {
        fs_1.default.writeFileSync(tsconfigUrl, JSON.stringify(exports.TS_CONFIG, null, 2));
        return tsconfigUrl;
    }
}
exports.writeTsConfig = writeTsConfig;
function checkMaybeIsTsProj(cwd, pkgInfo) {
    pkgInfo = pkgInfo || getPkgInfo(cwd);
    return (pkgInfo.egg && pkgInfo.egg.typescript) ||
        fs_1.default.existsSync(path_1.default.resolve(cwd, './tsconfig.json')) ||
        fs_1.default.existsSync(path_1.default.resolve(cwd, './config/config.default.ts')) ||
        fs_1.default.existsSync(path_1.default.resolve(cwd, './config/config.ts'));
}
exports.checkMaybeIsTsProj = checkMaybeIsTsProj;
function checkMaybeIsJsProj(cwd, pkgInfo) {
    pkgInfo = pkgInfo || getPkgInfo(cwd);
    const isJs = !checkMaybeIsTsProj(cwd, pkgInfo) &&
        (fs_1.default.existsSync(path_1.default.resolve(cwd, './config/config.default.js')) ||
            fs_1.default.existsSync(path_1.default.resolve(cwd, './jsconfig.json')));
    return isJs;
}
exports.checkMaybeIsJsProj = checkMaybeIsJsProj;
// load modules to object
function loadModules(cwd, loadDefault, preHandle) {
    const modules = {};
    preHandle = preHandle || (fn => fn);
    fs_1.default
        .readdirSync(cwd)
        .filter(f => f.endsWith('.js'))
        .forEach(f => {
        const name = f.substring(0, f.lastIndexOf('.'));
        const obj = require(path_1.default.resolve(cwd, name));
        if (loadDefault && obj.default) {
            modules[name] = preHandle(obj.default);
        }
        else {
            modules[name] = preHandle(obj);
        }
    });
    return modules;
}
exports.loadModules = loadModules;
// convert string to function
function strToFn(fn) {
    if (typeof fn === 'string') {
        return (...args) => fn.replace(/{{\s*(\d+)\s*}}/g, (_, index) => args[index]);
    }
    return fn;
}
exports.strToFn = strToFn;
// pick fields from object
function pickFields(obj, fields) {
    const newObj = {};
    fields.forEach(f => (newObj[f] = obj[f]));
    return newObj;
}
exports.pickFields = pickFields;
// log
function log(msg, prefix = true) {
    console.info(`${prefix ? '[egg-ts-helper] ' : ''}${msg}`);
}
exports.log = log;
// get import context
function getImportStr(from, to, moduleName, importStar) {
    const extname = path_1.default.extname(to);
    const toPathWithoutExt = to.substring(0, to.length - extname.length);
    const importPath = path_1.default.relative(from, toPathWithoutExt).replace(/\/|\\/g, '/');
    const isTS = extname === '.ts' || fs_1.default.existsSync(`${toPathWithoutExt}.d.ts`);
    const importStartStr = isTS && importStar ? '* as ' : '';
    const fromStr = isTS ? `from '${importPath}'` : `= require('${importPath}')`;
    return `import ${importStartStr}${moduleName} ${fromStr};`;
}
exports.getImportStr = getImportStr;
// write file, using fs.writeFileSync to block io that d.ts can create before egg app started.
function writeFileSync(fileUrl, content) {
    fs_1.default.mkdirSync(path_1.default.dirname(fileUrl), { recursive: true });
    fs_1.default.writeFileSync(fileUrl, content);
}
exports.writeFileSync = writeFileSync;
// clean same name js/ts
function cleanJs(cwd) {
    const fileList = [];
    globby_1.default
        .sync(['**/*.ts', '**/*.tsx', '!**/*.d.ts', '!**/node_modules', '!**/.sff'], { cwd })
        .forEach(f => {
        const jf = removeSameNameJs(path_1.default.resolve(cwd, f));
        if (jf)
            fileList.push(path_1.default.relative(cwd, jf));
    });
    if (fileList.length) {
        console.info('[egg-ts-helper] These file was deleted because the same name ts file was exist!\n');
        console.info('  ' + fileList.join('\n  ') + '\n');
    }
}
exports.cleanJs = cleanJs;
// get moduleName by file path
function getModuleObjByPath(f) {
    const props = f.substring(0, f.lastIndexOf('.')).split('/');
    // composing moduleName
    const moduleName = props.map(prop => camelProp(prop, 'upper')).join('');
    return {
        props,
        moduleName,
    };
}
exports.getModuleObjByPath = getModuleObjByPath;
// format path sep to /
function formatPath(str) {
    return str.replace(/\/|\\/g, '/');
}
exports.formatPath = formatPath;
function toArray(pattern) {
    return pattern ? (Array.isArray(pattern) ? pattern : [pattern]) : [];
}
exports.toArray = toArray;
// remove same name js
function removeSameNameJs(f) {
    if (!f.match(/\.tsx?$/) || f.endsWith('.d.ts')) {
        return;
    }
    const jf = f.replace(/tsx?$/, 'js');
    if (fs_1.default.existsSync(jf)) {
        fs_1.default.unlinkSync(jf);
        return jf;
    }
}
exports.removeSameNameJs = removeSameNameJs;
// resolve module
function resolveModule(url) {
    try {
        return require.resolve(url);
    }
    catch (e) {
        return undefined;
    }
}
exports.resolveModule = resolveModule;
// check whether module is exist
function moduleExist(mod, cwd) {
    const nodeModulePath = path_1.default.resolve(cwd || process.cwd(), 'node_modules', mod);
    return fs_1.default.existsSync(nodeModulePath) || resolveModule(mod);
}
exports.moduleExist = moduleExist;
// require modules
function requireFile(url) {
    url = url && resolveModule(url);
    if (!url) {
        return undefined;
    }
    let exp = require(url);
    if (exp.__esModule && 'default' in exp) {
        exp = exp.default;
    }
    return exp;
}
exports.requireFile = requireFile;
// extend
function extend(obj, ...args) {
    args.forEach(source => {
        let descriptor, prop;
        if (source) {
            for (prop in source) {
                descriptor = Object.getOwnPropertyDescriptor(source, prop);
                Object.defineProperty(obj, prop, descriptor);
            }
        }
    });
    return obj;
}
exports.extend = extend;
// parse json
function parseJson(jsonStr) {
    if (jsonStr) {
        try {
            return JSON.parse(jsonStr);
        }
        catch (e) {
            return {};
        }
    }
    else {
        return {};
    }
}
exports.parseJson = parseJson;
// load package.json
function getPkgInfo(cwd) {
    return readJson(path_1.default.resolve(cwd, 'package.json'));
}
exports.getPkgInfo = getPkgInfo;
// read json file
function readJson(jsonUrl) {
    if (!fs_1.default.existsSync(jsonUrl))
        return {};
    return parseJson(fs_1.default.readFileSync(jsonUrl, 'utf-8'));
}
exports.readJson = readJson;
function readJson5(jsonUrl) {
    if (!fs_1.default.existsSync(jsonUrl))
        return {};
    return json5_1.default.parse(fs_1.default.readFileSync(jsonUrl, 'utf-8'));
}
exports.readJson5 = readJson5;
// format property
function formatProp(prop) {
    return prop.replace(/[._-][a-z]/gi, s => s.substring(1).toUpperCase());
}
exports.formatProp = formatProp;
// like egg-core/file-loader
function camelProp(property, caseStyle) {
    if (typeof caseStyle === 'function') {
        return caseStyle(property);
    }
    // camel transfer
    property = formatProp(property);
    let first = property[0];
    // istanbul ignore next
    switch (caseStyle) {
        case 'lower':
            first = first.toLowerCase();
            break;
        case 'upper':
            first = first.toUpperCase();
            break;
        case 'camel':
            break;
        default:
            break;
    }
    return first + property.substring(1);
}
exports.camelProp = camelProp;
// load tsconfig.json
function loadTsConfig(tsconfigPath) {
    tsconfigPath = path_1.default.extname(tsconfigPath) === '.json' ? tsconfigPath : `${tsconfigPath}.json`;
    const tsConfig = readJson5(tsconfigPath);
    if (tsConfig.extends) {
        const extendPattern = tsConfig.extends;
        const tsconfigDirName = path_1.default.dirname(tsconfigPath);
        const maybeRealExtendPath = [
            path_1.default.resolve(tsconfigDirName, extendPattern),
            path_1.default.resolve(tsconfigDirName, `${extendPattern}.json`),
        ];
        if (!path_1.default.extname(tsConfig.extends) && !extendPattern.startsWith('.') && !extendPattern.startsWith('/')) {
            maybeRealExtendPath.push(path_1.default.resolve(tsconfigDirName, 'node_modules', extendPattern, 'tsconfig.json'), path_1.default.resolve(process.cwd(), 'node_modules', extendPattern, 'tsconfig.json'));
        }
        const extendRealPath = maybeRealExtendPath.find(f => fs_1.default.existsSync(f));
        if (extendRealPath) {
            const extendTsConfig = loadTsConfig(extendRealPath);
            return {
                ...tsConfig.compilerOptions,
                ...extendTsConfig,
            };
        }
    }
    return tsConfig.compilerOptions || {};
}
exports.loadTsConfig = loadTsConfig;
/**
 * ts ast utils
 */
// find export node from sourcefile.
function findExportNode(code) {
    const sourceFile = typescript_1.default.createSourceFile('file.ts', code, typescript_1.default.ScriptTarget.ES2017, true);
    const cache = new Map();
    const exportNodeList = [];
    let exportDefaultNode;
    sourceFile.statements.forEach(node => {
        // each node in root scope
        if (modifierHas(node, typescript_1.default.SyntaxKind.ExportKeyword)) {
            if (modifierHas(node, typescript_1.default.SyntaxKind.DefaultKeyword)) {
                // export default
                exportDefaultNode = node;
            }
            else {
                // export variable
                if (typescript_1.default.isVariableStatement(node)) {
                    node.declarationList.declarations.forEach(declare => exportNodeList.push(declare));
                }
                else {
                    exportNodeList.push(node);
                }
            }
        }
        else if (typescript_1.default.isVariableStatement(node)) {
            // cache variable statement
            for (const declaration of node.declarationList.declarations) {
                if (typescript_1.default.isIdentifier(declaration.name) && declaration.initializer) {
                    cache.set(declaration.name.escapedText, declaration.initializer);
                }
            }
        }
        else if ((typescript_1.default.isFunctionDeclaration(node) || typescript_1.default.isClassDeclaration(node)) && node.name) {
            // cache function declaration and class declaration
            cache.set(node.name.escapedText, node);
        }
        else if (typescript_1.default.isExportAssignment(node)) {
            // export default {}
            exportDefaultNode = node.expression;
        }
        else if (typescript_1.default.isExpressionStatement(node) && typescript_1.default.isBinaryExpression(node.expression)) {
            if (typescript_1.default.isPropertyAccessExpression(node.expression.left)) {
                const obj = node.expression.left.expression;
                const prop = node.expression.left.name;
                if (typescript_1.default.isIdentifier(obj)) {
                    if (obj.escapedText === 'exports') {
                        // exports.xxx = {}
                        exportNodeList.push(node.expression);
                    }
                    else if (obj.escapedText === 'module' &&
                        typescript_1.default.isIdentifier(prop) &&
                        prop.escapedText === 'exports') {
                        // module.exports = {}
                        exportDefaultNode = node.expression.right;
                    }
                }
            }
            else if (typescript_1.default.isIdentifier(node.expression.left)) {
                // let exportData;
                // exportData = {};
                // export exportData
                cache.set(node.expression.left.escapedText, node.expression.right);
            }
        }
    });
    while (exportDefaultNode && typescript_1.default.isIdentifier(exportDefaultNode) && cache.size) {
        const mid = cache.get(exportDefaultNode.escapedText);
        cache.delete(exportDefaultNode.escapedText);
        exportDefaultNode = mid;
    }
    return {
        exportDefaultNode,
        exportNodeList,
    };
}
exports.findExportNode = findExportNode;
function isClass(v) {
    return typeof v === 'function' && /^\s*class\s+/.test(v.toString());
}
exports.isClass = isClass;
// check kind in node.modifiers.
function modifierHas(node, kind) {
    return node.modifiers && node.modifiers.find(mod => kind === mod.kind);
}
exports.modifierHas = modifierHas;
function cleanEmpty(data) {
    const clearData = {};
    Object.keys(data).forEach(k => {
        const dataValue = data[k];
        if (dataValue !== undefined && dataValue !== null) {
            clearData[k] = data[k];
        }
    });
    return clearData;
}
exports.cleanEmpty = cleanEmpty;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNENBQW9CO0FBQ3BCLG9EQUEwQjtBQUMxQixnREFBd0I7QUFDeEIsNERBQTRCO0FBQzVCLDRDQUFvQjtBQUNwQixpREFBd0U7QUFDeEUsa0RBQTBCO0FBQzFCLHFDQUErQztBQUVsQyxRQUFBLFNBQVMsR0FBRztJQUN2QixPQUFPLEVBQUUsQ0FBRSxNQUFNLENBQUU7Q0FDcEIsQ0FBQztBQUVXLFFBQUEsU0FBUyxHQUEwQjtJQUM5QyxlQUFlLEVBQUU7UUFDZixNQUFNLEVBQUUsb0JBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTTtRQUM5QixNQUFNLEVBQUUsb0JBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUTtRQUM5QixNQUFNLEVBQUUsSUFBSTtRQUNaLGFBQWEsRUFBRSxLQUFLO1FBQ3BCLHNCQUFzQixFQUFFLElBQUk7UUFDNUIscUJBQXFCLEVBQUUsSUFBSTtRQUMzQiw0QkFBNEIsRUFBRSxJQUFJO1FBQ2xDLE9BQU8sRUFBRSxLQUFLO1FBQ2QsTUFBTSxFQUFFLElBQUk7UUFDWixHQUFHLEVBQUUsQ0FBRSxLQUFLLENBQUU7UUFDZCxhQUFhLEVBQUUsS0FBSztRQUNwQixjQUFjLEVBQUUsSUFBSTtRQUNwQixrQkFBa0IsRUFBRSxJQUFJO1FBQ3hCLG9CQUFvQixFQUFFLEtBQUs7UUFDM0IsaUJBQWlCLEVBQUUsS0FBSztRQUN4Qiw0QkFBNEIsRUFBRSxLQUFLO1FBQ25DLDBCQUEwQixFQUFFLElBQUk7UUFDaEMsWUFBWSxFQUFFLElBQUk7UUFDbEIsbUJBQW1CLEVBQUUsSUFBSTtRQUN6QixlQUFlLEVBQUUsSUFBSTtLQUN0QjtDQUNGLENBQUM7QUErQkYsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLFNBQWdCLFVBQVUsQ0FBc0MsTUFBcUI7SUFDbkYsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFH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