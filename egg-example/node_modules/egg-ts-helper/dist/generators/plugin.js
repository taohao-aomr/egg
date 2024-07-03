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
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
const utils = __importStar(require("../utils"));
function PluginGenerator(config, baseConfig) {
    const getContent = (eggInfo) => {
        const dist = path_1.default.resolve(config.dtsDir, 'plugin.d.ts');
        if (!eggInfo.plugins) {
            return { dist };
        }
        const appPluginNameList = [];
        const importContent = [];
        const framework = config.framework || baseConfig.framework;
        Object.keys(eggInfo.plugins).forEach(name => {
            const pluginInfo = eggInfo.plugins[name];
            if (pluginInfo.package && pluginInfo.from) {
                appPluginNameList.push(name);
                if (pluginInfo.enable) {
                    let pluginPath = pluginInfo.package;
                    if (!pluginPath || config.usePath) {
                        pluginPath = pluginInfo.path.replace(/\\/g, '/');
                    }
                    importContent.push(`import '${pluginPath}';`);
                }
            }
        });
        if (!appPluginNameList.length) {
            return { dist };
        }
        const composeInterface = (list) => {
            return `    ${list
                .map(name => `${utils.isIdentifierName(name) ? name : `'${name}'`}?: EggPluginItem;`)
                .join('\n    ')}`;
        };
        return {
            dist,
            content: `${importContent.join('\n')}\n` +
                `import { EggPluginItem } from '${framework}';\n` +
                `declare module '${framework}' {\n` +
                `  interface ${config.interface} {\n` +
                `${composeInterface(Array.from(new Set(appPluginNameList)))}\n` +
                '  }\n' +
                '}',
        };
    };
    return utils.getEggInfo({
        cwd: baseConfig.cwd,
        customLoader: baseConfig.customLoader,
        cacheIndex: baseConfig.id,
        async: !!config.file,
        callback: getContent,
    });
}
exports.default = PluginGenerator;
PluginGenerator.isPrivate = true;
// only load plugin.ts|plugin.local.ts|plugin.default.ts
PluginGenerator.defaultConfig = {
    pattern: 'plugin*(.local|.default).+(ts|js)',
    interface: config_1.declMapping.plugin,
    /** use path insteadof package while import plugins */
    usePath: false,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2dlbmVyYXRvcnMvcGx1Z2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsc0NBQXdDO0FBRXhDLGdEQUFrQztBQUVsQyxTQUF3QixlQUFlLENBQUMsTUFBbUIsRUFBRSxVQUEwQjtJQUNyRixNQUFNLFVBQVUsR0FBRyxDQUFDLE9BQTRCLEVBQUUsRUFBRTtRQUNsRCxNQUFNLElBQUksR0FBRyxjQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUU7WUFDcEIsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDO1NBQ2pCO1FBRUQsTUFBTSxpQkFBaUIsR0FBYSxFQUFFLENBQUM7UUFDdkMsTUFBTSxhQUFhLEdBQWEsRUFBRSxDQUFDO1FBQ25DLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLElBQUksVUFBVSxDQUFDLFNBQVMsQ0FBQztRQUMzRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDMUMsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLE9BQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxQyxJQUFJLFVBQVUsQ0FBQyxPQUFPLElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtnQkFDekMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM3QixJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUU7b0JBQ3JCLElBQUksVUFBVSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUM7b0JBQ3BDLElBQUksQ0FBQyxVQUFVLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTt3QkFDakMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDbEQ7b0JBRUQsYUFBYSxDQUFDLElBQUksQ0FBQyxXQUFXLFVBQVUsSUFBSSxDQUFDLENBQUM7aUJBQy9DO2FBQ0Y7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUU7WUFDN0IsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDO1NBQ2pCO1FBRUQsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLElBQWMsRUFBRSxFQUFFO1lBQzFDLE9BQU8sT0FBTyxJQUFJO2lCQUNmLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxHQUFHLG1CQUFtQixDQUFDO2lCQUNwRixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUN0QixDQUFDLENBQUM7UUFFRixPQUFPO1lBQ0wsSUFBSTtZQUVKLE9BQU8sRUFBRSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7Z0JBQ3RDLGtDQUFrQyxTQUFTLE1BQU07Z0JBQ2pELG1CQUFtQixTQUFTLE9BQU87Z0JBQ25DLGVBQWUsTUFBTSxDQUFDLFNBQVMsTUFBTTtnQkFDckMsR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxJQUFJO2dCQUMvRCxPQUFPO2dCQUNQLEdBQUc7U0FDTixDQUFDO0lBQ0osQ0FBQyxDQUFDO0lBRUYsT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ3RCLEdBQUcsRUFBRSxVQUFVLENBQUMsR0FBRztRQUNuQixZQUFZLEVBQUUsVUFBVSxDQUFDLFlBQVk7UUFDckMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxFQUFFO1FBQ3pCLEtBQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUk7UUFDcEIsUUFBUSxFQUFFLFVBQVU7S0FDckIsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXZERCxrQ0F1REM7QUFFRCxlQUFlLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztBQUVqQyx3REFBd0Q7QUFDeEQsZUFBZSxDQUFDLGFBQWEsR0FBRztJQUM5QixPQUFPLEVBQUUsbUNBQW1DO0lBQzVDLFNBQVMsRUFBRSxvQkFBVyxDQUFDLE1BQU07SUFFN0Isc0RBQXNEO0lBQ3RELE9BQU8sRUFBRSxLQUFLO0NBQ2YsQ0FBQyJ9