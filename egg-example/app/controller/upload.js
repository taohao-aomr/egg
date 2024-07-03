// app/controller/upload.js
const Controller = require('egg').Controller;
const fs = require('fs/promises');
const path = require('path'); // 补上缺失的 path 模块

class UploadController extends Controller {
  async upload() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    const name = 'egg-multipart-test/' + path.basename(file.filename);
    let result;
    try {
      // 处理文件，例如上传到云采存储
      result = await ctx.oss.put(name, file.filepath);
    } finally {
      // 注意删除临时文件
      await fs.unlink(file.filepath);
    }

    ctx.body = {
      url: result.url,
      // 获取全部字段值
      requestBody: ctx.request.body,
    };
  }
  async dom() {
    const { ctx } = this;
    await ctx.render('form/index.tpl');
  }
}

module.exports = UploadController;