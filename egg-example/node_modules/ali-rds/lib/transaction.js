"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RDSTransaction = void 0;
const operator_1 = require("./operator");
class RDSTransaction extends operator_1.Operator {
    isCommit = false;
    isRollback = false;
    conn;
    constructor(conn) {
        super();
        this.conn = conn;
    }
    async commit() {
        this.#check();
        try {
            return await this.conn.commit();
        }
        finally {
            this.isCommit = true;
            this.conn.release();
            this.conn = null;
        }
    }
    async rollback() {
        this.#check();
        try {
            return await this.conn.rollback();
        }
        finally {
            this.isRollback = true;
            this.conn.release();
            this.conn = null;
        }
    }
    async _query(sql) {
        this.#check();
        return await this.conn._query(sql);
    }
    #check() {
        if (!this.conn) {
            throw new Error('transaction was commit or rollback');
        }
    }
}
exports.RDSTransaction = RDSTransaction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHJhbnNhY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EseUNBQXNDO0FBRXRDLE1BQWEsY0FBZSxTQUFRLG1CQUFRO0lBQzFDLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDakIsVUFBVSxHQUFHLEtBQUssQ0FBQztJQUNuQixJQUFJLENBQXVCO0lBQzNCLFlBQVksSUFBbUI7UUFDN0IsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU07UUFDVixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZCxJQUFJO1lBQ0YsT0FBTyxNQUFNLElBQUksQ0FBQyxJQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDbEM7Z0JBQVM7WUFDUixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUNyQixJQUFJLENBQUMsSUFBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ2xCO0lBQ0gsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFRO1FBQ1osSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsSUFBSTtZQUNGLE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3BDO2dCQUFTO1lBQ1IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsSUFBSSxDQUFDLElBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztTQUNsQjtJQUNILENBQUM7SUFFUyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQVc7UUFDaEMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxNQUFNLElBQUksQ0FBQyxJQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7U0FDdkQ7SUFDSCxDQUFDO0NBQ0Y7QUF6Q0Qsd0NBeUNDIn0=