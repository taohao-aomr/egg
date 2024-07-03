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
const utils_1 = require("../utils");
const debug = (0, node_util_1.debuglog)('egg-bin:midddleware:inspect');
let default_1 = class {
    program;
    async configDidLoad() {
        // add global options
        // https://nodejs.org/dist/latest-v18.x/docs/api/cli.html#--inspect-brkhostport
        this.program.option({
            'inspect-brk': {
                description: 'Activate inspector and break at start of user script',
                type: 'boolean',
            },
            inspect: {
                description: 'Activate inspector',
                type: 'boolean',
            },
        });
        this.program.use(async (ctx, next) => {
            debug('before next');
            let hasInspectOption = false;
            if (ctx.args.inspect === true) {
                (0, utils_1.addNodeOptionsToEnv)('--inspect', ctx.env);
                hasInspectOption = true;
            }
            if (ctx.args['inspect-brk'] === true) {
                (0, utils_1.addNodeOptionsToEnv)('--inspect-brk', ctx.env);
                hasInspectOption = true;
            }
            if (hasInspectOption) {
                ctx.args.timeout = false;
                debug('set timeout = false when inspect enable, set env.NODE_OPTIONS=%o', ctx.env.NODE_OPTIONS);
            }
            else if (process.env.JB_DEBUG_FILE) {
                // others like WebStorm 2019 will pass NODE_OPTIONS, and egg-bin itself will be debug, so could detect `process.env.JB_DEBUG_FILE`.
                ctx.args.timeout = false;
                debug('set timeout = false when process.env.JB_DEBUG_FILE=%o', process.env.JB_DEBUG_FILE);
            }
            debug('enter next');
            await next();
            debug('after next');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zcGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL2luc3BlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBcUM7QUFDckMsb0RBRzhCO0FBQzlCLG9DQUErQztBQUUvQyxNQUFNLEtBQUssR0FBRyxJQUFBLG9CQUFRLEVBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUd2QyxnQkFBQTtJQUVJLE9BQU8sQ0FBVTtJQUc1QixBQUFOLEtBQUssQ0FBQyxhQUFhO1FBQ2pCLHFCQUFxQjtRQUNyQiwrRUFBK0U7UUFDL0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDbEIsYUFBYSxFQUFFO2dCQUNiLFdBQVcsRUFBRSxzREFBc0Q7Z0JBQ25FLElBQUksRUFBRSxTQUFTO2FBQ2hCO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLFdBQVcsRUFBRSxvQkFBb0I7Z0JBQ2pDLElBQUksRUFBRSxTQUFTO2FBQ2hCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQW1CLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDbkQsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3JCLElBQUksZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1lBQzdCLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssSUFBSSxFQUFFLENBQUM7Z0JBQzlCLElBQUEsMkJBQW1CLEVBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDMUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1lBQzFCLENBQUM7WUFDRCxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7Z0JBQ3JDLElBQUEsMkJBQW1CLEVBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDOUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1lBQzFCLENBQUM7WUFDRCxJQUFJLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3JCLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztnQkFDekIsS0FBSyxDQUFDLGtFQUFrRSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDbEcsQ0FBQztpQkFBTSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3JDLG1JQUFtSTtnQkFDbkksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO2dCQUN6QixLQUFLLENBQUMsdURBQXVELEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM1RixDQUFDO1lBQ0QsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sSUFBSSxFQUFFLENBQUM7WUFDYixLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0YsQ0FBQTtBQXpDa0I7SUFEaEIsSUFBQSxrQkFBTSxHQUFFOzhCQUNpQixtQkFBTzswQ0FBQztBQUc1QjtJQURMLElBQUEseUJBQWEsR0FBRTs7Ozs4Q0FzQ2Y7QUExQ1k7SUFEZCxJQUFBLDZCQUFpQixHQUFFO2FBNENuQiJ9