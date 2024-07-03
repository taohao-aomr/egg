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
const utils = __importStar(require("../utils"));
const class_1 = __importDefault(require("./class"));
function FunctionGenerator(config, baseConfig) {
    config.interfaceHandle = config.interfaceHandle || 'ReturnType<typeof {{ 0 }}>';
    return (0, class_1.default)(config, baseConfig);
}
exports.default = FunctionGenerator;
FunctionGenerator.defaultConfig = utils.extend({}, class_1.default.defaultConfig);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZ2VuZXJhdG9ycy9mdW5jdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsZ0RBQWtDO0FBQ2xDLG9EQUFxQztBQUVyQyxTQUF3QixpQkFBaUIsQ0FBQyxNQUFtQixFQUFFLFVBQTBCO0lBQ3ZGLE1BQU0sQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLGVBQWUsSUFBSSw0QkFBNEIsQ0FBQztJQUNoRixPQUFPLElBQUEsZUFBYyxFQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBSEQsb0NBR0M7QUFFRCxpQkFBaUIsQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsZUFBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDIn0=