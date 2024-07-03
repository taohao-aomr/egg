"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("./lib/mysql");
class AppBootHook {
    app;
    constructor(app) {
        this.app = app;
    }
    configDidLoad() {
        if (this.app.config.mysql.app) {
            (0, mysql_1.initPlugin)(this.app);
        }
    }
}
exports.default = AppBootHook;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsdUNBQXlDO0FBRXpDLE1BQXFCLFdBQVc7SUFDYixHQUFHLENBQWM7SUFDbEMsWUFBWSxHQUFnQjtRQUMxQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNqQixDQUFDO0lBRUQsYUFBYTtRQUNYLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtZQUM3QixJQUFBLGtCQUFVLEVBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3RCO0lBQ0gsQ0FBQztDQUNGO0FBWEQsOEJBV0MifQ==