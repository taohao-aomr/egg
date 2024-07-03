"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTsConfig = exports.readPackageJSON = exports.addNodeOptionsToEnv = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
function addNodeOptionsToEnv(options, env) {
    if (env.NODE_OPTIONS) {
        if (!env.NODE_OPTIONS.includes(options)) {
            env.NODE_OPTIONS = `${env.NODE_OPTIONS} ${options}`;
        }
    }
    else {
        env.NODE_OPTIONS = options;
    }
}
exports.addNodeOptionsToEnv = addNodeOptionsToEnv;
async function readPackageJSON(baseDir) {
    const pkgFile = node_path_1.default.join(baseDir, 'package.json');
    try {
        const pkgJSON = await promises_1.default.readFile(pkgFile, 'utf8');
        return JSON.parse(pkgJSON);
    }
    catch {
        return {};
    }
}
exports.readPackageJSON = readPackageJSON;
async function hasTsConfig(baseDir) {
    const pkgFile = node_path_1.default.join(baseDir, 'tsconfig.json');
    try {
        await promises_1.default.access(pkgFile);
        return true;
    }
    catch {
        return false;
    }
}
exports.hasTsConfig = hasTsConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0VBQWtDO0FBQ2xDLDBEQUE2QjtBQUU3QixTQUFnQixtQkFBbUIsQ0FBQyxPQUFlLEVBQUUsR0FBd0I7SUFDM0UsSUFBSSxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDeEMsR0FBRyxDQUFDLFlBQVksR0FBRyxHQUFHLEdBQUcsQ0FBQyxZQUFZLElBQUksT0FBTyxFQUFFLENBQUM7UUFDdEQsQ0FBQztJQUNILENBQUM7U0FBTSxDQUFDO1FBQ04sR0FBRyxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUM7SUFDN0IsQ0FBQztBQUNILENBQUM7QUFSRCxrREFRQztBQUVNLEtBQUssVUFBVSxlQUFlLENBQUMsT0FBZTtJQUNuRCxNQUFNLE9BQU8sR0FBRyxtQkFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDbkQsSUFBSSxDQUFDO1FBQ0gsTUFBTSxPQUFPLEdBQUcsTUFBTSxrQkFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbkQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFBQyxNQUFNLENBQUM7UUFDUCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7QUFDSCxDQUFDO0FBUkQsMENBUUM7QUFFTSxLQUFLLFVBQVUsV0FBVyxDQUFDLE9BQWU7SUFDL0MsTUFBTSxPQUFPLEdBQUcsbUJBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ3BELElBQUksQ0FBQztRQUNILE1BQU0sa0JBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQUMsTUFBTSxDQUFDO1FBQ1AsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0FBQ0gsQ0FBQztBQVJELGtDQVFDIn0=