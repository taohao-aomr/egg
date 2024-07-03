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
const util_1 = require("util");
const path_1 = __importDefault(require("path"));
const utils = __importStar(require("../utils"));
const debug = (0, util_1.debuglog)('egg-ts-helper#generators_class');
function ClassGenerator(config, baseConfig) {
    const fileList = config.fileList;
    const dist = path_1.default.resolve(config.dtsDir, config.distName);
    debug('file list : %o', fileList);
    if (!fileList.length) {
        return { dist };
    }
    // using to compose import code
    let importStr = '';
    // using to create interface mapping
    const interfaceMap = {};
    fileList.forEach(f => {
        const { props, moduleName: sModuleName } = utils.getModuleObjByPath(f);
        const moduleName = `Export${sModuleName}`;
        const importContext = utils.getImportStr(config.dtsDir, path_1.default.join(config.dir, f), moduleName);
        importStr += `${importContext}\n`;
        // create mapping
        let collector = interfaceMap;
        while (props.length) {
            const name = utils.camelProp(props.shift(), config.caseStyle || baseConfig.caseStyle);
            if (!props.length) {
                collector[name] = moduleName;
            }
            else {
                collector = collector[name] = typeof collector[name] === 'object' ? collector[name] : Object.create(Object.prototype, {
                    parentModuleName: {
                        value: typeof collector[name] === 'string' ? collector[name] : undefined,
                    },
                });
            }
        }
    });
    // interface name
    const interfaceName = config.interface || `T_${config.name.replace(/[\.\-]/g, '_')}`;
    // add mount interface
    let declareInterface;
    if (config.declareTo) {
        const interfaceList = config.declareTo.split('.');
        declareInterface = composeInterface(interfaceList.slice(1).concat(interfaceName), interfaceList[0], undefined, '  ');
    }
    return {
        dist,
        content: `${importStr}\n` +
            `declare module '${config.framework || baseConfig.framework}' {\n` +
            (declareInterface ? `${declareInterface}\n` : '') +
            composeInterface(interfaceMap, interfaceName, utils.strToFn(config.interfaceHandle), '  ') +
            '}\n',
    };
}
exports.default = ClassGenerator;
ClassGenerator.defaultConfig = {
    distName: 'index.d.ts',
};
// composing all the interface
function composeInterface(obj, wrapInterface, preHandle, indent) {
    let prev = '';
    let mid = '';
    let after = '';
    indent = indent || '';
    if (wrapInterface) {
        prev = `${indent}interface ${wrapInterface} {\n`;
        after = `${indent}}\n`;
        indent += '  ';
    }
    // compose array to object
    // ['abc', 'bbc', 'ccc'] => { abc: { bbc: 'ccc' } }
    if (Array.isArray(obj)) {
        let curr = obj.pop();
        while (obj.length) {
            curr = { [obj.pop()]: curr };
        }
        obj = curr;
    }
    Object.keys(obj).forEach(key => {
        const val = obj[key];
        if (typeof val === 'string') {
            mid += `${indent + key}: ${preHandle ? preHandle(val) : val};\n`;
        }
        else {
            const newVal = composeInterface(val, undefined, preHandle, indent + '  ');
            if (newVal) {
                mid += `${indent + key}: ${val.parentModuleName ? `${val.parentModuleName} & ` : ''}{\n${newVal + indent}}\n`;
            }
        }
    });
    return `${prev}${mid}${after}`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZ2VuZXJhdG9ycy9jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0JBQWdDO0FBQ2hDLGdEQUF3QjtBQUV4QixnREFBa0M7QUFFbEMsTUFBTSxLQUFLLEdBQUcsSUFBQSxlQUFRLEVBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUV6RCxTQUF3QixjQUFjLENBQUMsTUFBbUIsRUFBRSxVQUEwQjtJQUNwRixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ2pDLE1BQU0sSUFBSSxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFMUQsS0FBSyxDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO1FBQ3BCLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQztLQUNqQjtJQUVELCtCQUErQjtJQUMvQixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDbkIsb0NBQW9DO0lBQ3BDLE1BQU0sWUFBWSxHQUFnQixFQUFFLENBQUM7SUFFckMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNuQixNQUFNLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkUsTUFBTSxVQUFVLEdBQUcsU0FBUyxXQUFXLEVBQUUsQ0FBQztRQUMxQyxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUN0QyxNQUFNLENBQUMsTUFBTSxFQUNiLGNBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFDeEIsVUFBVSxDQUNY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