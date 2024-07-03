"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkConfigReturnType = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const typescript_1 = __importDefault(require("typescript"));
const config_1 = require("../config");
const utils = __importStar(require("../utils"));
const base_1 = require("./base");
const EXPORT_DEFAULT_FUNCTION = 1;
const EXPORT_DEFAULT = 2;
const EXPORT = 3;
const globalCache = {};
class ConfigGenerator extends base_1.BaseGenerator {
    buildParams(config) {
        const { baseConfig } = this;
        const fileList = config.fileList;
        const cache = globalCache[baseConfig.id] = globalCache[baseConfig.id] || {};
        if (!fileList.length)
            return;
        const importList = [];
        const declarationList = [];
        const moduleList = [];
        fileList.forEach(f => {
            const abUrl = path_1.default.resolve(config.dir, f);
            // read from cache
            if (!cache[abUrl] || config.file === abUrl) {
                const skipLibCheck = !!baseConfig.tsConfig.skipLibCheck;
                const { type, usePowerPartial } = checkConfigReturnType(abUrl);
                // skip when not usePowerPartial and skipLibCheck in ts file
                // because it maybe cause types error.
                if (path_1.default.extname(f) !== '.js' && !usePowerPartial && !skipLibCheck)
                    return;
                const { moduleName: sModuleName } = utils.getModuleObjByPath(f);
                const moduleName = `Export${sModuleName}`;
                const importContext = utils.getImportStr(config.dtsDir, abUrl, moduleName, type === EXPORT);
                let tds = `type ${sModuleName} = `;
                if (type === EXPORT_DEFAULT_FUNCTION) {
                    tds += `ReturnType<typeof ${moduleName}>;`;
                }
                else if (type === EXPORT_DEFAULT || type === EXPORT) {
                    tds += `typeof ${moduleName};`;
                }
                else {
                    return;
                }
                // cache the file
                cache[abUrl] = {
                    import: importContext,
                    declaration: tds,
                    moduleName: sModuleName,
                };
            }
            const cacheItem = cache[abUrl];
            importList.push(cacheItem.import);
            declarationList.push(cacheItem.declaration);
            moduleList.push(cacheItem.moduleName);
        });
        return {
            importList,
            declarationList,
            moduleList,
        };
    }
    renderWithParams(config, params) {
        const dist = path_1.default.resolve(config.dtsDir, 'index.d.ts');
        if (!params)
            return { dist };
        if (!params.importList.length)
            return { dist };
        const { baseConfig } = this;
        const { importList, declarationList, moduleList } = params;
        const newConfigType = `New${config.interface}`;
        return {
            dist,
            content: `import { ${config.interface} } from '${baseConfig.framework}';\n` +
                `${importList.join('\n')}\n` +
                `${declarationList.join('\n')}\n` +
                `type ${newConfigType} = ${moduleList.join(' & ')};\n` +
                `declare module '${baseConfig.framework}' {\n` +
                `  interface ${config.interface} extends ${newConfigType} { }\n` +
                '}',
        };
    }
}
ConfigGenerator.defaultConfig = {
    // only need to parse config.default.ts or config.ts
    pattern: 'config(.default|).(ts|js)',
    interface: config_1.declMapping.config,
};
exports.default = ConfigGenerator;
// check config return type.
function checkConfigReturnType(f) {
    const result = utils.findExportNode(fs_1.default.readFileSync(f, 'utf-8'));
    const resp = {
        type: undefined,
        usePowerPartial: false,
    };
    if (result.exportDefaultNode) {
        const exportDefaultNode = result.exportDefaultNode;
        if (typescript_1.default.isFunctionLike(exportDefaultNode)) {
            if ((typescript_1.default.isFunctionDeclaration(exportDefaultNode) || typescript_1.default.isArrowFunction(exportDefaultNode)) && exportDefaultNode.body) {
                exportDefaultNode.body.forEachChild(tNode => {
                    if (!resp.usePowerPartial && typescript_1.default.isVariableStatement(tNode)) {
                        // check wether use PowerPartial<EggAppInfo>
                        resp.usePowerPartial = !!tNode.declarationList.declarations.find(decl => {
                            let typeText = decl.type ? decl.type.getText() : undefined;
                            if (decl.initializer && typescript_1.default.isAsExpression(decl.initializer) && decl.initializer.type) {
                                typeText = decl.initializer.type.getText();
                            }
                            return !!(typeText && typeText.includes('PowerPartial') && typeText.includes('EggAppConfig'));
                        });
                    }
                });
            }
            resp.type = EXPORT_DEFAULT_FUNCTION;
        }
        else {
            resp.type = EXPORT_DEFAULT;
        }
    }
    else if (result.exportNodeList.length) {
        resp.type = EXPORT;
    }
    return resp;
}
exports.checkConfigReturnType = checkConfigReturnType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2dlbmVyYXRvcnMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNENBQW9CO0FBQ3BCLGdEQUF3QjtBQUN4Qiw0REFBNEI7QUFFNUIsc0NBQXdDO0FBQ3hDLGdEQUFrQztBQUNsQyxpQ0FBdUM7QUFFdkMsTUFBTSx1QkFBdUIsR0FBRyxDQUFDLENBQUM7QUFDbEMsTUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNqQixNQUFNLFdBQVcsR0FBcUQsRUFBRSxDQUFDO0FBY3pFLE1BQXFCLGVBQWdCLFNBQVEsb0JBQWdEO0lBTzNGLFdBQVcsQ0FBQyxNQUFtQjtRQUM3QixNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQzVCLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDakMsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM1RSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU07WUFBRSxPQUFPO1FBRTdCLE1BQU0sVUFBVSxHQUFhLEVBQUUsQ0FBQztRQUNoQyxNQUFNLGVBQWUsR0FBYSxFQUFFLENBQUM7UUFDckMsTUFBTSxVQUFVLEdBQWEsRUFBRSxDQUFDO1FBQ2hDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDbkIsTUFBTSxLQUFLLEdBQUcsY0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRTFDLGtCQUFrQjtZQUNsQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJ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