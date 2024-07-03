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
function AutoGenerator(config, baseConfig) {
    config.interfaceHandle = config.interfaceHandle || 'AutoInstanceType<typeof {{ 0 }}>';
    const result = (0, class_1.default)(config, baseConfig);
    /* istanbul ignore else */
    if (result.content) {
        result.content = [
            'type AnyClass = new (...args: any[]) => any;',
            'type AnyFunc<T = any> = (...args: any[]) => T;',
            'type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;',
            'type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;',
            result.content,
        ].join('\n');
    }
    return result;
}
exports.default = AutoGenerator;
AutoGenerator.defaultConfig = utils.extend({}, class_1.default.defaultConfig);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9nZW5lcmF0b3JzL2F1dG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGdEQUFrQztBQUNsQyxvREFBcUM7QUFFckMsU0FBd0IsYUFBYSxDQUFDLE1BQW1CLEVBQUUsVUFBMEI7SUFDbkYsTUFBTSxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUMsZUFBZSxJQUFJLGtDQUFrQyxDQUFDO0lBRXRGLE1BQU0sTUFBTSxHQUFHLElBQUEsZUFBYyxFQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNsRCwwQkFBMEI7SUFDMUIsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO1FBQ2xCLE1BQU0sQ0FBQyxPQUFPLEdBQUc7WUFDZiw4Q0FBOEM7WUFDOUMsZ0RBQWdEO1lBQ2hELDhFQUE4RTtZQUM5RSwrSUFBK0k7WUFDL0ksTUFBTSxDQUFDLE9BQU87U0FDZixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNkO0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQWhCRCxnQ0FnQkM7QUFFRCxhQUFhLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGVBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQyJ9