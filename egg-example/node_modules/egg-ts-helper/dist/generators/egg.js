"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
// declare global namespace Egg
function EggGenerator(config, baseConfig) {
    return {
        dist: path_1.default.resolve(config.dtsDir, 'index.d.ts'),
        content: `export * from '${baseConfig.framework}';\n` +
            'export as namespace Egg;\n',
    };
}
exports.default = EggGenerator;
EggGenerator.isPrivate = true;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWdnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2dlbmVyYXRvcnMvZWdnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsZ0RBQXdCO0FBRXhCLCtCQUErQjtBQUMvQixTQUF3QixZQUFZLENBQUMsTUFBbUIsRUFBRSxVQUEwQjtJQUNsRixPQUFPO1FBQ0wsSUFBSSxFQUFFLGNBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUM7UUFDL0MsT0FBTyxFQUNMLGtCQUFrQixVQUFVLENBQUMsU0FBUyxNQUFNO1lBQzVDLDRCQUE0QjtLQUMvQixDQUFDO0FBQ0osQ0FBQztBQVBELCtCQU9DO0FBRUQsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMifQ==