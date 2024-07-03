
const cluster = {
    listen: {
      port: 7002,
      hostname: '127.0.0.1', // 不建议设置为 '0.0.0.0'，可能导致外部连接风险，请了解后使用
      // path: '/var/run/egg.sock',
    },
};

const keys = 'my-cookie-secret-key';

const view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
  };

const news = {
    pageSize: 5,
    serverUrl: 'https://hacker-news.firebaseio.com/v0',
};

const middleware = [
    'robot',
    'notFound'
];
const robot = {
    ua: [/curl/i, /Baiduspider/i]
};

const i18n = {
    defaultLocale: 'zh-CN',
    queryField: 'locale',
    cookieField: 'locale',
    // Cookie 默认一年后过期, 如果设置为 Number，则单位为 ms
    cookieMaxAge: '1y',
  };
const multipart = {
    mode: 'file',
    fileExtensions: ['.apk'], // 增加对 '.apk' 扩展名的文件支持
    whitelist: ['.png'] // 覆盖整个白名单，只允许上传 '.png' 格式
  };

  const security = {
    domainWhiteList: ['.domain.com'] // 安全白名单，以 "." 开头
  };

  const mysql = {
    client: {
      host: 'sh-cdb-dlbmibsa.sql.tencentcdb.com',
      port: '26547',
      user: 'root',
      password: 'taohao9541@TH',
      database: 'hnmj'

    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: true,

  };

module.exports = (appInfo) => {
    // console.log(appInfo);
    return {
        cluster,
        keys,
        view,
        news,
        middleware,
        robot,
        i18n,
        multipart,
        security,
        mysql,
    }
}