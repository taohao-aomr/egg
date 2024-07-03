// app/controller/user.js
const Controller = require('egg').Controller;
class UserController extends Controller {
    // 获取用户列表
    async getUserList() {
        const { ctx } = this;
        const result = await ctx.service.user.getUserList();
        ctx.body = result;
    }
    // 获取用户详情
    async getUserDetail() {
        const { ctx } = this;
        const result = await ctx.service.user.getUserDetail();
        ctx.body = result;
    }
    // 新建或者更新用户
    async creatOrUpdata() {
        const { ctx } = this;
        const result = await ctx.service.user.creatOrUpdata();
        ctx.body = result;
    }
    // 删除用户
    async deleteUserById() {
        const { ctx } = this;
        const result = await ctx.service.user.deleteUserById();
        ctx.body = result;
    }
}
module.exports = UserController;