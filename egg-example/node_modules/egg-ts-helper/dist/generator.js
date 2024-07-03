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
exports.PluginGenerator = exports.ObjectGenerator = exports.FunctionGenerator = exports.ExtendGenerator = exports.EggGenerator = exports.CustomGenerator = exports.ClassGenerator = exports.ConfigGenerator = exports.AutoGenerator = exports.BaseGenerator = exports.formatGenerator = exports.loadGenerator = exports.getGenerator = exports.isPrivateGenerator = exports.registerGenerator = exports.generators = void 0;
const config_1 = __importDefault(require("./generators/config"));
exports.ConfigGenerator = config_1.default;
const auto_1 = __importDefault(require("./generators/auto"));
exports.AutoGenerator = auto_1.default;
const class_1 = __importDefault(require("./generators/class"));
exports.ClassGenerator = class_1.default;
const custom_1 = __importDefault(require("./generators/custom"));
exports.CustomGenerator = custom_1.default;
const egg_1 = __importDefault(require("./generators/egg"));
exports.EggGenerator = egg_1.default;
const extend_1 = __importDefault(require("./generators/extend"));
exports.ExtendGenerator = extend_1.default;
const function_1 = __importDefault(require("./generators/function"));
exports.FunctionGenerator = function_1.default;
const object_1 = __importDefault(require("./generators/object"));
exports.ObjectGenerator = object_1.default;
const plugin_1 = __importDefault(require("./generators/plugin"));
exports.PluginGenerator = plugin_1.default;
const base_1 = require("./generators/base");
Object.defineProperty(exports, "BaseGenerator", { enumerable: true, get: function () { return base_1.BaseGenerator; } });
const utils = __importStar(require("./utils"));
const path_1 = __importDefault(require("path"));
const assert = require("assert");
exports.generators = {
    auto: auto_1.default,
    config: config_1.default,
    class: class_1.default,
    custom: custom_1.default,
    egg: egg_1.default,
    extend: extend_1.default,
    function: function_1.default,
    object: object_1.default,
    plugin: plugin_1.default,
};
function registerGenerator(name, generator) {
    exports.generators[name] = generator;
}
exports.registerGenerator = registerGenerator;
function isPrivateGenerator(name) {
    return !!getGenerator(name)?.isPrivate;
}
exports.isPrivateGenerator = isPrivateGenerator;
function getGenerator(name) {
    return formatGenerator(exports.generators[name]);
}
exports.getGenerator = getGenerator;
function loadGenerator(name, option) {
    const type = typeof name;
    const typeIsString = type === 'string';
    let generator = typeIsString ? getGenerator(name) : name;
    if (!generator && typeIsString) {
        // try to load generator as module path
        const generatorPath = utils.resolveModule(name.startsWith('.')
            ? path_1.default.join(option.cwd, name)
            : name);
        if (generatorPath) {
            generator = require(generatorPath);
        }
    }
    generator = formatGenerator(generator);
    assert(typeof generator === 'function', `generator: ${name} not exist!!`);
    return generator;
}
exports.loadGenerator = loadGenerator;
function formatGenerator(generator) {
    // check esm default
    if (generator && typeof generator.default === 'function') {
        generator.default.defaultConfig = generator.defaultConfig || generator.default.defaultConfig;
        generator.default.isPrivate = generator.isPrivate || generator.default.isPrivate;
        generator = generator.default;
    }
    return generator;
}
exports.formatGenerator = formatGenerator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2dlbmVyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlFQUFrRDtBQTBFaEQsMEJBMUVLLGdCQUFlLENBMEVMO0FBekVqQiw2REFBOEM7QUF3RTVDLHdCQXhFSyxjQUFhLENBd0VMO0FBdkVmLCtEQUFnRDtBQXlFOUMseUJBekVLLGVBQWMsQ0F5RUw7QUF4RWhCLGlFQUFrRDtBQXlFaEQsMEJBekVLLGdCQUFlLENBeUVMO0FBeEVqQiwyREFBNEM7QUF5RTFDLHVCQXpFSyxhQUFZLENBeUVMO0FBeEVkLGlFQUFrRDtBQXlFaEQsMEJBekVLLGdCQUFlLENBeUVMO0FBeEVqQixxRUFBc0Q7QUF5RXBELDRCQXpFSyxrQkFBaUIsQ0F5RUw7QUF4RW5CLGlFQUFrRDtBQXlFaEQsMEJBekVLLGdCQUFlLENBeUVMO0FBeEVqQixpRUFBa0Q7QUF5RWhELDBCQXpFSyxnQkFBZSxDQXlFTDtBQXhFakIsNENBQWtEO0FBK0RoRCw4RkEvRE8sb0JBQWEsT0ErRFA7QUE5RGYsK0NBQWlDO0FBQ2pDLGdEQUF3QjtBQUN4QixpQ0FBa0M7QUFHckIsUUFBQSxVQUFVLEdBQUc7SUFDeEIsSUFBSSxFQUFFLGNBQWE7SUFDbkIsTUFBTSxFQUFFLGdCQUFlO0lBQ3ZCLEtBQUssRUFBRSxlQUFjO0lBQ3JCLE1BQU0sRUFBRSxnQkFBZTtJQUN2QixHQUFHLEVBQUUsYUFBWTtJQUNqQixNQUFNLEVBQUUsZ0JBQWU7SUFDdkIsUUFBUSxFQUFFLGtCQUFpQjtJQUMzQixNQUFNLEVBQUUsZ0JBQWU7SUFDdkIsTUFBTSxFQUFFLGdCQUFlO0NBQ3hCLENBQUM7QUFFRixTQUFnQixpQkFBaUIsQ0FBQyxJQUFZLEVBQUUsU0FBeUI7SUFDdkUsa0JBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUM7QUFDL0IsQ0FBQztBQUZELDhDQUVDO0FBRUQsU0FBZ0Isa0JBQWtCLENBQUMsSUFBWTtJQUM3QyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxDQUFDO0FBQ3pDLENBQUM7QUFGRCxnREFFQztBQUVELFNBQWdCLFlBQVksQ0FBQyxJQUFZO0lBQ3ZDLE9BQU8sZUFBZSxDQUFDLGtCQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBRkQsb0NBRUM7QUFFRCxTQUFnQixhQUFhLENBQUMsSUFBUyxFQUFFLE1BQXdCO0lBQy9ELE1BQU0sSUFBSSxHQUFHLE9BQU8sSUFBSSxDQUFDO0lBQ3pCLE1BQU0sWUFBWSxHQUFHLElBQUksS0FBSyxRQUFRLENBQUM7SUFDdkMsSUFBSSxTQUFTLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUV6RCxJQUFJLENBQUMsU0FBUyxJQUFJLFlBQVksRUFBRTtRQUM5Qix1Q0FBdUM7UUFDdkMsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztZQUM1RCxDQUFDLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQztZQUM3QixDQUFDLENBQUMsSUFBSSxDQUNQLENBQUM7UUFFRixJQUFJLGFBQWEsRUFBRTtZQUNqQixTQUFTLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3BDO0tBQ0Y7SUFFRCxTQUFTLEdBQUcsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZDLE1BQU0sQ0FBQyxPQUFPLFNBQVMsS0FBSyxVQUFVLEVBQUUsY0FBYyxJQUFJLGNBQWMsQ0FBQyxDQUFDO0lBQzFFLE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFwQkQsc0NBb0JDO0FBRUQsU0FBZ0IsZUFBZSxDQUFDLFNBQVM7SUFDdkMsb0JBQW9CO0lBQ3BCLElBQUksU0FBUyxJQUFJLE9BQU8sU0FBUyxDQUFDLE9BQU8sS0FBSyxVQUFVLEVBQUU7UUFDeEQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDLGFBQWEsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztRQUM3RixTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO1FBQ2pGLFNBQVMsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDO0tBQy9CO0lBQ0QsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQVJELDBDQVFDIn0=