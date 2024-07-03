"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = void 0;
const cluster_1 = __importDefault(require("cluster"));
const util_1 = require("util");
const core_1 = __importDefault(require("./core"));
const utils_1 = require("./utils");
const debug = (0, util_1.debuglog)('egg-ts-helper#register');
class Register {
    constructor(options) {
        this.tsHelperClazz = options?.tsHelperClazz || core_1.default;
    }
    init(options) {
        /* istanbul ignore else */
        if (!cluster_1.default.isMaster)
            return;
        // make sure ets only run once
        const pid = process.env.ETS_REGISTER_PID;
        if (pid) {
            debug('egg-ts-helper watcher has ran in %s', pid);
            return;
        }
        const watch = (0, utils_1.convertString)(process.env.ETS_WATCH, process.env.NODE_ENV !== 'test');
        const clazz = this.tsHelperClazz;
        const cwd = options?.cwd || process.cwd();
        const instance = new clazz({ watch, ...options });
        if ((0, utils_1.checkMaybeIsJsProj)(cwd)) {
            // write jsconfig if the project is wrote by js
            (0, utils_1.writeJsConfig)(cwd);
        }
        else {
            const tsNodeMode = process.env.EGG_TYPESCRIPT === 'true';
            // no need to clean in js project
            // clean local js file at first.
            // because egg-loader cannot load the same property name to egg.
            if (tsNodeMode && instance.config.autoRemoveJs) {
                (0, utils_1.cleanJs)(cwd);
            }
        }
        // cache pid to env, prevent child process executing ets again
        process.env.ETS_REGISTER_PID = `${process.pid}`;
        debug('start buidling');
        // exec building
        instance.build();
        debug('end');
        // reset ETS_REGISTER_PID
        process.env.ETS_REGISTER_PID = '';
    }
}
exports.default = Register;
exports.Register = Register;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcmVnaXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLCtCQUFnQztBQUNoQyxrREFBa0Q7QUFDbEQsbUNBRWlCO0FBRWpCLE1BQU0sS0FBSyxHQUFHLElBQUEsZUFBUSxFQUFDLHdCQUF3QixDQUFDLENBQUM7QUFNakQsTUFBcUIsUUFBUTtJQUczQixZQUFZLE9BQXdCO1FBQ2xDLElBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxFQUFFLGFBQWEsSUFBSSxjQUFRLENBQUM7SUFDMUQsQ0FBQztJQUVELElBQUksQ0FBQyxPQUF3QjtRQUMzQiwwQkFBMEI7UUFDMUIsSUFBSSxDQUFDLGlCQUFPLENBQUMsUUFBUTtZQUFFLE9BQU87UUFFOUIsOEJBQThCO1FBQzlCLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7UUFDekMsSUFBSSxHQUFHLEVBQUU7WUFDUCxLQUFLLENBQUMscUNBQXFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDbEQsT0FBTztTQUNSO1FBRUQsTUFBTSxLQUFLLEdBQUcsSUFBQSxxQkFBYSxFQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLE1BQU0sQ0FBQyxDQUFDO1FBQ3BGLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDakMsTUFBTSxHQUFHLEdBQUcsT0FBTyxFQUFFLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRSxLQUFLLEVBQUUsR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRWxELElBQUksSUFBQSwwQkFBa0IsRUFBQyxHQUFHLENBQUMsRUFBRTtZQUMzQiwrQ0FBK0M7WUFDL0MsSUFBQSxxQkFBYSxFQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3BCO2FBQU07WUFDTCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsS0FBSyxNQUFNLENBQUM7WUFFekQsaUNBQWlDO1lBQ2pDLGdDQUFnQztZQUNoQyxnRUFBZ0U7WUFDaEUsSUFBSSxVQUFVLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7Z0JBQzlDLElBQUEsZUFBTyxFQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2Q7U0FDRjtRQUVELDhEQUE4RDtRQUM5RCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRWhELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3hCLGdCQUFnQjtRQUNoQixRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDakIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2IseUJBQXlCO1FBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0lBQ3BDLENBQUM7Q0FDRjtBQS9DRCwyQkErQ0M7QUFFUSw0QkFBUSJ9