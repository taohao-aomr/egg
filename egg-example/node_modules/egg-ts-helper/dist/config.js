"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.declMapping = exports.dtsComment = exports.dtsCommentRE = exports.eggInfoPath = exports.tmpDir = void 0;
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
const root = path_1.default.dirname(__dirname);
const packInfo = (0, utils_1.getPkgInfo)(root);
exports.tmpDir = path_1.default.join(root, '.tmp');
exports.eggInfoPath = path_1.default.resolve(exports.tmpDir, 'eggInfo.json');
exports.dtsCommentRE = new RegExp(`^\\/\\/ [\\w ]+ ${packInfo.name}(@\\d+\\.\\d+\\.\\d+)?`);
exports.dtsComment = `// This file is created by ${packInfo.name}@${packInfo.version}\n` +
    '// Do not modify this file!!!!!!!!!\n' +
    '/* eslint-disable */\n';
// mapping declaration in egg
exports.declMapping = {
    service: 'IService',
    controller: 'IController',
    ctx: 'Context',
    context: 'Context',
    app: 'Application',
    application: 'Application',
    agent: 'Agent',
    request: 'Request',
    response: 'Response',
    helper: 'IHelper',
    middleware: 'IMiddleware',
    config: 'EggAppConfig',
    plugin: 'EggPlugin',
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsbUNBQXFDO0FBRXJDLE1BQU0sSUFBSSxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckMsTUFBTSxRQUFRLEdBQUcsSUFBQSxrQkFBVSxFQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JCLFFBQUEsTUFBTSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2pDLFFBQUEsV0FBVyxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUMsY0FBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQ25ELFFBQUEsWUFBWSxHQUFHLElBQUksTUFBTSxDQUFDLG1CQUFtQixRQUFRLENBQUMsSUFBSSx3QkFBd0IsQ0FBQyxDQUFDO0FBQ3BGLFFBQUEsVUFBVSxHQUNyQiw4QkFBOEIsUUFBUSxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsT0FBTyxJQUFJO0lBQ25FLHVDQUF1QztJQUN2Qyx3QkFBd0IsQ0FBQztBQUUzQiw2QkFBNkI7QUFDaEIsUUFBQSxXQUFXLEdBQUc7SUFDekIsT0FBTyxFQUFFLFVBQVU7SUFDbkIsVUFBVSxFQUFFLGFBQWE7SUFDekIsR0FBRyxFQUFFLFNBQVM7SUFDZCxPQUFPLEVBQUUsU0FBUztJQUNsQixHQUFHLEVBQUUsYUFBYTtJQUNsQixXQUFXLEVBQUUsYUFBYTtJQUMxQixLQUFLLEVBQUUsT0FBTztJQUNkLE9BQU8sRUFBRSxTQUFTO0lBQ2xCLFFBQVEsRUFBRSxVQUFVO0lBQ3BCLE1BQU0sRUFBRSxTQUFTO0lBQ2pCLFVBQVUsRUFBRSxhQUFhO0lBQ3pCLE1BQU0sRUFBRSxjQUFjO0lBQ3RCLE1BQU0sRUFBRSxXQUFXO0NBQ3BCLENBQUMifQ==