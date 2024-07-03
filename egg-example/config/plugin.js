const nunjucks = {
    enable: true,
    package: 'egg-view-nunjucks',
  };
// 提供便捷的参数校验机制，帮助我们完成各种复杂的参数校验。
const validate = {
    enable: true,
    package: 'egg-validate',
};
// 使用 mysql 插件
const mysql = {
    enable: true,
    package: 'egg-mysql',
};

module.exports = {
    nunjucks,
    validate,
    mysql
}