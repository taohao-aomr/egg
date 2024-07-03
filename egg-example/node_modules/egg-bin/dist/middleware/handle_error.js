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
const node_util_1 = require("node:util");
const artus_cli_1 = require("@artus-cli/artus-cli");
const debug = (0, node_util_1.debuglog)('egg-bin:midddleware:handle_error');
let default_1 = class {
    program;
    async configDidLoad() {
        this.program.use(async (_, next) => {
            debug('enter next');
            try {
                await next();
                debug('after next');
            }
            catch (err) {
                debug('next error: %o', err);
                // let artus cli to handle it
                if (err instanceof artus_cli_1.ArtusCliError)
                    throw err;
                console.error(err);
                process.exit(typeof err.code === 'number' ? err.code : 1);
            }
        });
    }
};
__decorate([
    (0, artus_cli_1.Inject)(),
    __metadata("design:type", artus_cli_1.Program)
], default_1.prototype, "program", void 0);
__decorate([
    (0, artus_cli_1.LifecycleHook)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], default_1.prototype, "configDidLoad", null);
default_1 = __decorate([
    (0, artus_cli_1.LifecycleHookUnit)()
], default_1);
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlX2Vycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21pZGRsZXdhcmUvaGFuZGxlX2Vycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEseUNBQXFDO0FBQ3JDLG9EQUc4QjtBQUU5QixNQUFNLEtBQUssR0FBRyxJQUFBLG9CQUFRLEVBQUMsa0NBQWtDLENBQUMsQ0FBQztBQUc1QyxnQkFBQTtJQUVJLE9BQU8sQ0FBVTtJQUc1QixBQUFOLEtBQUssQ0FBQyxhQUFhO1FBQ2pCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDakMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQztnQkFDSCxNQUFNLElBQUksRUFBRSxDQUFDO2dCQUNiLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN0QixDQUFDO1lBQUMsT0FBTyxHQUFRLEVBQUUsQ0FBQztnQkFDbEIsS0FBSyxDQUFDLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM3Qiw2QkFBNkI7Z0JBQzdCLElBQUksR0FBRyxZQUFZLHlCQUFhO29CQUFFLE1BQU0sR0FBRyxDQUFDO2dCQUM1QyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNuQixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVELENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRixDQUFBO0FBbEJrQjtJQURoQixJQUFBLGtCQUFNLEdBQUU7OEJBQ2lCLG1CQUFPOzBDQUFDO0FBRzVCO0lBREwsSUFBQSx5QkFBYSxHQUFFOzs7OzhDQWVmO0FBbkJZO0lBRGQsSUFBQSw2QkFBaUIsR0FBRTthQXFCbkIifQ==