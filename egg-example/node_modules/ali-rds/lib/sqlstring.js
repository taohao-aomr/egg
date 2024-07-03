"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlString = void 0;
const SqlString_1 = __importDefault(require("mysql/lib/protocol/SqlString"));
exports.SqlString = SqlString_1.default;
const literals_1 = require("./literals");
const kEscape = Symbol('kEscape');
if (!SqlString_1.default[kEscape]) {
    SqlString_1.default[kEscape] = SqlString_1.default.escape;
    SqlString_1.default.escape = (val, stringifyObjects, timeZone) => {
        if (val instanceof literals_1.Literal) {
            return val.toString();
        }
        return SqlString_1.default[kEscape](val, stringifyObjects, timeZone);
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Fsc3RyaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NxbHN0cmluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw2RUFBcUQ7QUFnQjVDLG9CQWhCRixtQkFBUyxDQWdCRTtBQWZsQix5Q0FBcUM7QUFFckMsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRWxDLElBQUksQ0FBQyxtQkFBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQ3ZCLG1CQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsbUJBQVMsQ0FBQyxNQUFNLENBQUM7SUFFdEMsbUJBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFRLEVBQUUsZ0JBQTBCLEVBQUUsUUFBaUIsRUFBRSxFQUFFO1FBQzdFLElBQUksR0FBRyxZQUFZLGtCQUFPLEVBQUU7WUFDMUIsT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDdkI7UUFDRCxPQUFPLG1CQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzdELENBQUMsQ0FBQztDQUNIIn0=