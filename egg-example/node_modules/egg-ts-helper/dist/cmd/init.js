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
const enquirer_1 = require("enquirer");
const utils = __importStar(require("../utils"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const __1 = require("../");
const TYPE_TS = 'typescript';
const TYPE_JS = 'javascript';
class InitCommand {
    constructor() {
        this.description = 'Init egg-ts-helper in your existing project';
        this.options = '<type>';
    }
    async run(_, { args, cwd }) {
        let type = args[1];
        const pkgInfo = utils.getPkgInfo(cwd);
        const typeList = [TYPE_TS, TYPE_JS];
        pkgInfo.egg = pkgInfo.egg || {};
        // verify type
        if (!typeList.includes(type)) {
            const result = await (0, enquirer_1.prompt)({
                type: 'autocomplete',
                name: 'type',
                message: 'Choose the type of your project',
                choices: utils.checkMaybeIsJsProj(cwd) ? typeList.reverse() : typeList,
            }).catch(() => {
                utils.log('cancel initialization');
                return { type: '' };
            });
            type = result.type;
        }
        if (type === TYPE_JS) {
            // create jsconfig.json
            const result = utils.writeJsConfig(cwd);
            if (result) {
                utils.log('create ' + result);
            }
        }
        else if (type === TYPE_TS) {
            pkgInfo.egg.typescript = true;
            // create tsconfig.json
            const result = utils.writeTsConfig(cwd);
            if (result) {
                utils.log('create ' + result);
            }
        }
        else {
            return;
        }
        // add egg-ts-helper/register to egg.require
        pkgInfo.egg.require = pkgInfo.egg.require || [];
        if (!pkgInfo.egg.require.includes('egg-ts-helper/register') && !pkgInfo.egg.declarations) {
            pkgInfo.egg.declarations = true;
        }
        // write package.json
        const pkgDist = path_1.default.resolve(cwd, './package.json');
        fs_1.default.writeFileSync(pkgDist, JSON.stringify(pkgInfo, null, 2));
        utils.log('change ' + pkgDist);
        // build once
        utils.log('create d.ts ...');
        (0, __1.createTsHelperInstance)({ cwd }).build();
        utils.log('complete initialization');
    }
}
exports.default = new InitCommand();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbWQvaW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQWtDO0FBQ2xDLGdEQUFrQztBQUNsQyxnREFBd0I7QUFDeEIsNENBQW9CO0FBQ3BCLDJCQUE2QztBQUU3QyxNQUFNLE9BQU8sR0FBRyxZQUFZLENBQUM7QUFDN0IsTUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDO0FBRTdCLE1BQU0sV0FBVztJQUFqQjtRQUNFLGdCQUFXLEdBQUcsNkNBQTZDLENBQUM7UUFFNUQsWUFBTyxHQUFHLFFBQVEsQ0FBQztJQTBEckIsQ0FBQztJQXhEQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQW9CO1FBQzFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sUUFBUSxHQUFHLENBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBRSxDQUFDO1FBRXRDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUM7UUFFaEMsY0FBYztRQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzVCLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBQSxpQkFBTSxFQUFtQjtnQkFDNUMsSUFBSSxFQUFFLGNBQWM7Z0JBQ3BCLElBQUksRUFBRSxNQUFNO2dCQUNaLE9BQU8sRUFBRSxpQ0FBaUM7Z0JBQzFDLE9BQU8sRUFBRSxLQUFLLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTthQUN2RSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtnQkFDWixLQUFLLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7Z0JBQ25DLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdEIsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztTQUNwQjtRQUVELElBQUksSUFBSSxLQUFLLE9BQU8sRUFBRTtZQUNwQix1QkFBdUI7WUFDdkIsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN4QyxJQUFJLE1BQU0sRUFBRTtnQkFDVixLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsQ0FBQzthQUMvQjtTQUNGO2FBQU0sSUFBSSxJQUFJLEtBQUssT0FBTyxFQUFFO1lBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUU5Qix1QkFBdUI7WUFDdkIsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN4QyxJQUFJLE1BQU0sRUFBRTtnQkFDVixLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsQ0FBQzthQUMvQjtTQUNGO2FBQU07WUFDTCxPQUFPO1NBQ1I7UUFFRCw0Q0FBNEM7UUFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQ2hELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFO1lBQ3hGLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztTQUNqQztRQUVELHFCQUFxQjtRQUNyQixNQUFNLE9BQU8sR0FBRyxjQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3BELFlBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBRS9CLGFBQWE7UUFDYixLQUFLLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDN0IsSUFBQSwwQkFBc0IsRUFBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDeEMsS0FBSyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7Q0FDRjtBQUVELGtCQUFlLElBQUksV0FBVyxFQUFFLENBQUMifQ==