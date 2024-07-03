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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utils = __importStar(require("../utils"));
const config_1 = require("../config");
const debug = (0, util_1.debuglog)('egg-ts-helper#generators_extend');
function ExtendGenerator(config, baseConfig) {
    const fileList = config.file ? [config.file] : config.fileList;
    debug('file list : %o', fileList);
    if (!fileList.length) {
        // clean files
        return Object.keys(config.interface).map(key => ({
            dist: path_1.default.resolve(config.dtsDir, `${key}.d.ts`),
        }));
    }
    const tsList = [];
    fileList.forEach(f => {
        let basename = path_1.default.basename(f);
        basename = basename.substring(0, basename.lastIndexOf('.'));
        const moduleNames = basename.split('.');
        const interfaceNameKey = moduleNames[0];
        const interfaceEnvironment = moduleNames[1]
            ? moduleNames[1].replace(/^[a-z]/, r => r.toUpperCase())
            : '';
        const interfaceName = config.interface[interfaceNameKey];
        if (!interfaceName) {
            return;
        }
        const dist = path_1.default.resolve(config.dtsDir, `${basename}.d.ts`);
        f = path_1.default.resolve(config.dir, f);
        if (!fs_1.default.existsSync(f)) {
            return tsList.push({ dist });
        }
        // get import info
        const moduleName = `Extend${interfaceEnvironment}${interfaceName}`;
        const importContext = utils.getImportStr(config.dtsDir, f, moduleName);
        tsList.push({
            dist,
            content: `${importContext}\n` +
                `type ${moduleName}Type = typeof ${moduleName};\n` +
                `declare module \'${baseConfig.framework}\' {\n` +
                `  interface ${interfaceName} extends ${moduleName}Type { }\n` +
                '}',
        });
    });
    return tsList;
}
exports.default = ExtendGenerator;
// default config
ExtendGenerator.defaultConfig = {
    interface: utils.pickFields(config_1.declMapping, [
        'context',
        'application',
        'agent',
        'request',
        'response',
        'helper',
    ]),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2dlbmVyYXRvcnMvZXh0ZW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQkFBZ0M7QUFDaEMsNENBQW9CO0FBQ3BCLGdEQUF3QjtBQUN4QixnREFBa0M7QUFDbEMsc0NBQXdDO0FBR3hDLE1BQU0sS0FBSyxHQUFHLElBQUEsZUFBUSxFQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFFMUQsU0FBd0IsZUFBZSxDQUFDLE1BQW1CLEVBQUUsVUFBMEI7SUFDckYsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBRSxNQUFNLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFFakUsS0FBSyxDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO1FBQ3BCLGNBQWM7UUFDZCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDL0MsSUFBSSxFQUFFLGNBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsT0FBTyxDQUFDO1NBQ2pELENBQUMsQ0FBQyxDQUFDO0tBQ0w7SUFFRCxNQUFNLE1BQU0sR0FBc0IsRUFBRSxDQUFDO0lBQ3JDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDbkIsSUFBSSxRQUFRLEdBQUcsY0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzVELE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEMsTUFBTSxnQkFBZ0IsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsTUFBTSxvQkFBb0IsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN4RCxDQUFDLENBQUMsRUFBRSxDQUFDO1FBRVAsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDbEIsT0FBTztTQUNSO1FBRUQsTUFBTSxJQUFJLEdBQUcsY0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsUUFBUSxPQUFPLENBQUMsQ0FBQztRQUM3RCxDQUFDLEdBQUcsY0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxZQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3JCLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7U0FDOUI7UUFFRCxrQkFBa0I7UUFDbEIsTUFBTSxVQUFVLEdBQUcsU0FBUyxvQkFBb0IsR0FBRyxhQUFhLEVBQUUsQ0FBQztRQUNuRSxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDVixJQUFJO1lBQ0osT0FBTyxFQUNMLEdBQUcsYUFBYSxJQUFJO2dCQUNwQixRQUFRLFVBQVUsaUJBQWlCLFVBQVUsS0FBSztnQkFDbEQsb0JBQW9CLFVBQVUsQ0FBQyxTQUFTLFFBQVE7Z0JBQ2hELGVBQWUsYUFBYSxZQUFZLFVBQVUsWUFBWTtnQkFDOUQsR0FBRztTQUNOLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQS9DRCxrQ0ErQ0M7QUFFRCxpQkFBaUI7QUFDakIsZUFBZSxDQUFDLGFBQWEsR0FBRztJQUM5QixTQUFTLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBMkIsb0JBQVcsRUFBRTtRQUNqRSxTQUFTO1FBQ1QsYUFBYTtRQUNiLE9BQU87UUFDUCxTQUFTO1FBQ1QsVUFBVTtRQUNWLFFBQVE7S0FDVCxDQUFDO0NBQ0gsQ0FBQyJ9