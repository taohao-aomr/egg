"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPlugin = void 0;
const ali_rds_1 = require("ali-rds");
let count = 0;
function createOneClient(config, app) {
    app.coreLogger.info('[egg-mysql] connecting %s@%s:%s/%s', config.user, config.host, config.port, config.database);
    const client = new ali_rds_1.RDSClient(config);
    app.beforeStart(async () => {
        const rows = await client.query('select now() as currentTime;');
        const index = count++;
        app.coreLogger.info('[egg-mysql] instance[%s] status OK, rds currentTime: %s', index, rows[0].currentTime);
    });
    return client;
}
function initPlugin(app) {
    app.addSingleton('mysql', createOneClient);
    // alias to app.mysqls
    // https://github.com/eggjs/egg/blob/9ad39f59991bd48633b8da4abe1da5eb79a1de62/lib/core/singleton.js#L38
    app.mysqls = app.mysql;
}
exports.initPlugin = initPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXlzcWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJteXNxbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxQ0FBb0M7QUFFcEMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsU0FBUyxlQUFlLENBQUMsTUFBMkIsRUFBRSxHQUF3QjtJQUM1RSxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsRUFDdEQsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzFELE1BQU0sTUFBTSxHQUFHLElBQUksbUJBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVyQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ3pCLE1BQU0sSUFBSSxHQUFHLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sS0FBSyxHQUFHLEtBQUssRUFBRSxDQUFDO1FBQ3RCLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLHlEQUF5RCxFQUMzRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ2hDLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELFNBQWdCLFVBQVUsQ0FBQyxHQUF3QjtJQUNqRCxHQUFHLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQztJQUMzQyxzQkFBc0I7SUFDdEIsdUdBQXVHO0lBQ3RHLEdBQVcsQ0FBQyxNQUFNLEdBQUksR0FBVyxDQUFDLEtBQUssQ0FBQztBQUMzQyxDQUFDO0FBTEQsZ0NBS0MifQ==