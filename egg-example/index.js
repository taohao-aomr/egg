const { startCluster } = require('egg-cluster');

startCluster({
  baseDir: __dirname,
  workers: 2,
});
