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
const config_1 = require("../config");
const utils = __importStar(require("../utils"));
const path_1 = __importDefault(require("path"));
const customWatcherName = 'custom';
const customSpecRef = `${customWatcherName}_spec_ref`;
const DeclareMapping = utils.pickFields(config_1.declMapping, ['ctx', 'app']);
function CustomGenerator(config, baseConfig, tsHelper) {
    const createCustomLoader = (eggInfo) => {
        const eggConfig = eggInfo.config || {};
        const newCustomWatcherList = [];
        if (eggConfig.customLoader) {
            Object.keys(eggConfig.customLoader).forEach(key => {
                const loaderConfig = eggConfig.customLoader[key];
                if (!loaderConfig || !loaderConfig.directory) {
                    return;
                }
                loaderConfig.inject = loaderConfig.inject || 'app';
                if (!DeclareMapping[loaderConfig.inject] || loaderConfig.tsd === false)
                    return;
                // custom d.ts name
                const name = `${customWatcherName}-${key}`;
                newCustomWatcherList.push(name);
                // create a custom watcher
                tsHelper.registerWatcher(name, {
                    ref: customSpecRef,
                    distName: `${name}.d.ts`,
                    directory: loaderConfig.directory,
                    pattern: loaderConfig.match,
                    ignore: loaderConfig.ignore,
                    caseStyle: loaderConfig.caseStyle || 'lower',
                    interface: loaderConfig.interface || config_1.declMapping[key],
                    declareTo: `${DeclareMapping[loaderConfig.inject]}.${key}`,
                    generator: 'auto',
                    execAtInit: true,
                });
            });
        }
        // collect watcher which is need to remove.
        const removeList = tsHelper.watcherList.filter(w => (w.ref === customSpecRef && !newCustomWatcherList.includes(w.name)));
        // remove watcher and old d.ts
        tsHelper.destroyWatcher.apply(tsHelper, removeList.map(w => w.name));
        return removeList.map(w => ({
            dist: path_1.default.resolve(w.dtsDir, `${w.name}.d.ts`),
        }));
    };
    // reload egg info by file
    return utils.getEggInfo({
        cwd: baseConfig.cwd,
        customLoader: baseConfig.customLoader,
        cacheIndex: baseConfig.id,
        async: !!config.file,
        callback: createCustomLoader,
    });
}
exports.default = CustomGenerator;
CustomGenerator.isPrivate = true;
CustomGenerator.defaultConfig = {
    directory: 'config',
    execAtInit: true,
    pattern: [
        'config*(.local|.default).+(ts|js)',
        'plugin*(.local|.default).+(ts|js)',
    ],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2dlbmVyYXRvcnMvY3VzdG9tLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxzQ0FBd0M7QUFDeEMsZ0RBQWtDO0FBQ2xDLGdEQUF3QjtBQUV4QixNQUFNLGlCQUFpQixHQUFHLFFBQVEsQ0FBQztBQUNuQyxNQUFNLGFBQWEsR0FBRyxHQUFHLGlCQUFpQixXQUFXLENBQUM7QUFDdEQsTUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBMkIsb0JBQVcsRUFBRSxDQUFFLEtBQUssRUFBRSxLQUFLLENBQUUsQ0FBQyxDQUFDO0FBRWpHLFNBQXdCLGVBQWUsQ0FBQyxNQUFtQixFQUFFLFVBQTBCLEVBQUUsUUFBa0I7SUFDekcsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLE9BQTRCLEVBQUUsRUFBRTtRQUMxRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztRQUN2QyxNQUFNLG9CQUFvQixHQUFhLEVBQUUsQ0FBQztRQUUxQyxJQUFJLFNBQVMsQ0FBQyxZQUFZLEVBQUU7WUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNoRCxNQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqRCxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRTtvQkFDNUMsT0FBTztpQkFDUjtnQkFFRCxZQUFZLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDO2dCQUNuRCxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxZQUFZLENBQUMsR0FBRyxLQUFLLEtBQUs7b0JBQUUsT0FBTztnQkFFL0UsbUJBQW1CO2dCQUNuQixNQUFNLElBQUksR0FBRyxHQUFHLGlCQUFpQixJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUMzQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRWhDLDBCQUEwQjtnQkFDMUIsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUU7b0JBQzdCLEdBQUcsRUFBRSxhQUFhO29CQUNsQixRQUFRLEVBQUUsR0FBRyxJQUFJLE9BQU87b0JBQ3hCLFNBQVMsRUFBRSxZQUFZLENBQUMsU0FBUztvQkFDakMsT0FBTyxFQUFFLFlBQVksQ0FBQyxLQUFLO29CQUMzQixNQUFNLEVBQUUsWUFBWSxDQUFDLE1BQU07b0JBQzNCLFNBQVMsRUFBRSxZQUFZLENBQUMsU0FBUyxJQUFJLE9BQU87b0JBQzVDLFNBQVMsRUFBRSxZQUFZLENBQUMsU0FBUyxJQUFJLG9CQUFXLENBQUMsR0FBRyxDQUFDO29CQUNyRCxTQUFTLEVBQUUsR0FBRyxjQUFjLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsRUFBRTtvQkFDMUQsU0FBUyxFQUFFLE1BQU07b0JBQ2pCLFVBQVUsRUFBRSxJQUFJO2lCQUNqQixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztTQUNKO1FBRUQsMkNBQTJDO1FBQzNDLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDbEQsQ0FBQyxDQUFDLEdBQUcsS0FBSyxhQUFhLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUNsRSxDQUFDLENBQUM7UUFFSCw4QkFBOEI7UUFDOUIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNyRSxPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzFCLElBQUksRUFBRSxjQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUM7U0FDL0MsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDLENBQUM7SUFFRiwwQkFBMEI7SUFDMUIsT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ3RCLEdBQUcsRUFBRSxVQUFVLENBQUMsR0FBRztRQUNuQixZQUFZLEVBQUUsVUFBVSxDQUFDLFlBQVk7UUFDckMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxFQUFFO1FBQ3pCLEtBQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUk7UUFDcEIsUUFBUSxFQUFFLGtCQUFrQjtLQUM3QixDQUFDLENBQUM7QUFDTCxDQUFDO0FBdkRELGtDQXVEQztBQUVELGVBQWUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLGVBQWUsQ0FBQyxhQUFhLEdBQUc7SUFDOUIsU0FBUyxFQUFFLFFBQVE7SUFDbkIsVUFBVSxFQUFFLElBQUk7SUFDaEIsT0FBTyxFQUFFO1FBQ1AsbUNBQW1DO1FBQ25DLG1DQUFtQztLQUNwQztDQUNGLENBQUMifQ==