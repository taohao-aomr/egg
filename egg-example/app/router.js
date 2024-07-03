module.exports = app => {
    const { router, controller } = app;

    router.get('/', controller.home.index);

    router.get('/news', controller.news.list);

    router.get('/upload', controller.upload.dom);

    router.get('/getUserList', controller.user.getUserList);//获取用户类表
    router.get('/getUserDetail', controller.user.getUserDetail);//获取用户详情
    router.post('/creatOrUpdata', controller.user.creatOrUpdata);//新建或者更新用户信息
    router.delete('/deleteUserById', controller.user.deleteUserById);//删除
  };