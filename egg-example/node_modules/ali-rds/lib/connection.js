"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RDSConnection = void 0;
const node_util_1 = require("node:util");
const operator_1 = require("./operator");
const kWrapToRDS = Symbol('kWrapToRDS');
class RDSConnection extends operator_1.Operator {
    conn;
    constructor(conn) {
        super();
        this.conn = conn;
        if (!this.conn[kWrapToRDS]) {
            [
                'query',
                'beginTransaction',
                'commit',
                'rollback',
            ].forEach(key => {
                this.conn[key] = (0, node_util_1.promisify)(this.conn[key]);
            });
            this.conn[kWrapToRDS] = true;
        }
    }
    release() {
        return this.conn.release();
    }
    async _query(sql) {
        return await this.conn.query(sql);
    }
    async beginTransaction() {
        return await this.conn.beginTransaction();
    }
    async commit() {
        return await this.conn.commit();
    }
    async rollback() {
        return await this.conn.rollback();
    }
}
exports.RDSConnection = RDSConnection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25uZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlDQUFzQztBQUN0Qyx5Q0FBc0M7QUFHdEMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBRXhDLE1BQWEsYUFBYyxTQUFRLG1CQUFRO0lBQ3pDLElBQUksQ0FBMEI7SUFDOUIsWUFBWSxJQUE2QjtRQUN2QyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQzFCO2dCQUNFLE9BQU87Z0JBQ1Asa0JBQWtCO2dCQUNsQixRQUFRO2dCQUNSLFVBQVU7YUFDWCxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUEscUJBQVMsRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDN0MsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQztTQUM5QjtJQUNILENBQUM7SUFFRCxPQUFPO1FBQ0wsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQVc7UUFDdEIsT0FBTyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxLQUFLLENBQUMsZ0JBQWdCO1FBQ3BCLE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDNUMsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNO1FBQ1YsT0FBTyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFRO1FBQ1osT0FBTyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDcEMsQ0FBQztDQUNGO0FBckNELHNDQXFDQyJ9