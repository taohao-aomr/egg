"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const utils_1 = require("../utils");
class CleanCommand {
    constructor() {
        this.description = 'Clean js file while it has the same name ts/tsx file';
    }
    async run(_, { cwd }) {
        (0, utils_1.cleanJs)(cwd);
        console.info(chalk_1.default.red('\nWARNING: `ets clean` has been deprecated! Use `tsc -b --clean` instead\n'));
    }
}
exports.default = new CleanCommand();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY21kL2NsZWFuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLG9DQUFtQztBQUVuQyxNQUFNLFlBQVk7SUFBbEI7UUFDRSxnQkFBVyxHQUFHLHNEQUFzRCxDQUFDO0lBTXZFLENBQUM7SUFKQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBb0I7UUFDcEMsSUFBQSxlQUFPLEVBQUMsR0FBRyxDQUFDLENBQUM7UUFDYixPQUFPLENBQUMsSUFBSSxDQUFDLGVBQUssQ0FBQyxHQUFHLENBQUMsNEVBQTRFLENBQUMsQ0FBQyxDQUFDO0lBQ3hHLENBQUM7Q0FDRjtBQUVELGtCQUFlLElBQUksWUFBWSxFQUFFLENBQUMifQ==