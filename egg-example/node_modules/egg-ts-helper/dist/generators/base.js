"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGenerator = void 0;
class BaseGenerator {
    constructor(baseConfig, tsHelper) {
        this.baseConfig = baseConfig;
        this.tsHelper = tsHelper;
    }
    render(config) {
        const params = this.buildParams(config);
        return this.renderWithParams(config, params);
    }
}
exports.BaseGenerator = BaseGenerator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9nZW5lcmF0b3JzL2Jhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBT0EsTUFBc0IsYUFBYTtJQUNqQyxZQUNTLFVBQTBCLEVBQzFCLFFBQWtCO1FBRGxCLGVBQVUsR0FBVixVQUFVLENBQWdCO1FBQzFCLGFBQVEsR0FBUixRQUFRLENBQVU7SUFDeEIsQ0FBQztJQUVKLE1BQU0sQ0FBQyxNQUFtQjtRQUN4QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMvQyxDQUFDO0NBT0Y7QUFoQkQsc0NBZ0JDIn0=