// app/service/user.js
const Service = require('egg').Service;
class UserService extends Service {
    // 获取列表
    async getUserList() {
        let { app } = this;
        let result = await app.mysql.query('select * from userInfo');
        return {
            data: result,
        };
    }
    // 获取详情
    async getUserDetail() {
        let param = this.ctx.query
        let { app } = this;
        let result = await app.mysql.query('select * from userInfo where id=?', param.id);
        return {
            data: result,
        };
    }
    // 新建或者编辑
    async creatOrUpdata() {
        let param = this.ctx.request.body
        let { app } = this;
        let result
        if (this.ctx.request.body.id) {
            if (app.mysql.query('select * from userInfo where id=?', param.id)) {
                result = await app.mysql.update('userInfo', param)  // 参数1：表名  参数2：数据
            } else {
                result = await app.mysql.insert('userInfo', param)  // 参数1：表名  参数2：数据
            }
        } else {
            result = await app.mysql.insert('userInfo', param)  // 参数1：表名  参数2：数据
        }
        return {
            data: result,
        };
    }
    // 删除用户
    async deleteUserById() {
        let param = this.ctx.query
        let { app } = this;
        let result = await app.mysql.delete('userInfo', param)
        return {
            data: result,
        };
    }
}
module.exports = UserService;