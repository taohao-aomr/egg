"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugCommand = void 0;
const artus_cli_1 = require("@artus-cli/artus-cli");
let DebugCommand = class DebugCommand extends artus_cli_1.Command {
    utils;
    async run() {
        await this.utils.redirect(['dev', '--inspect']);
    }
};
exports.DebugCommand = DebugCommand;
__decorate([
    (0, artus_cli_1.Inject)(),
    __metadata("design:type", artus_cli_1.Utils)
], DebugCommand.prototype, "utils", void 0);
exports.DebugCommand = DebugCommand = __decorate([
    (0, artus_cli_1.DefineCommand)({
        command: 'debug',
        description: 'Alias to `egg-bin dev --inspect`',
    })
], DebugCommand);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY21kL2RlYnVnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG9EQUE2RTtBQU10RSxJQUFNLFlBQVksR0FBbEIsTUFBTSxZQUFhLFNBQVEsbUJBQU87SUFFdkMsS0FBSyxDQUFRO0lBRWIsS0FBSyxDQUFDLEdBQUc7UUFDUCxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBRSxDQUFDLENBQUM7SUFDcEQsQ0FBQztDQUNGLENBQUE7QUFQWSxvQ0FBWTtBQUV2QjtJQURDLElBQUEsa0JBQU0sR0FBRTs4QkFDRixpQkFBSzsyQ0FBQzt1QkFGRixZQUFZO0lBSnhCLElBQUEseUJBQWEsRUFBQztRQUNiLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLFdBQVcsRUFBRSxrQ0FBa0M7S0FDaEQsQ0FBQztHQUNXLFlBQVksQ0FPeEIifQ==