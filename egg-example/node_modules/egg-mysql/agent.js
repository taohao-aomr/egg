"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("./lib/mysql");
class AgentBootHook {
    agent;
    constructor(agent) {
        this.agent = agent;
    }
    configDidLoad() {
        if (this.agent.config.mysql.agent) {
            (0, mysql_1.initPlugin)(this.agent);
        }
    }
}
exports.default = AgentBootHook;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhZ2VudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHVDQUF5QztBQUV6QyxNQUFxQixhQUFhO0lBQ2YsS0FBSyxDQUFRO0lBQzlCLFlBQVksS0FBWTtRQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixDQUFDO0lBRUQsYUFBYTtRQUNYLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtZQUNqQyxJQUFBLGtCQUFVLEVBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQztDQUNGO0FBWEQsZ0NBV0MifQ==