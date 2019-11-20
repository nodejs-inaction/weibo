// 用户路由
const Router = require('koa-router');
const service = require('../services/user');
const router = new Router({prefix: '/user'});

router.get('/login', async (ctx) => {
    await ctx.render('user/login');
});

router.post('/login', async (ctx) => {
    const {username, password} = ctx.request.body;
    if (!username || !password) {
        throw new Error('请填写完整!');
    }
    const user = await service.login(username, password);
    ctx.cookies.set('userId', user.id, {
        signed: true,
        maxAge: 3600 * 24 * 1000
    });
    await ctx.redirect('/');
});

router.get('/register', async (ctx) => {
    await ctx.render('user/register');
});

router.post('/register', async (ctx) => {
    const {username, password, confirmPassword} = ctx.request.body;
    if (!username || !password || !confirmPassword) {
        throw new Error('请填写完整!');
    }
    if (password !== confirmPassword) {
        throw new Error('确认密码不一致');
    }
    await service.register(username, password);
    await ctx.redirect('/user/login');
});

router.get('/logout', async (ctx) => {
    ctx.cookies.set('userId', null, {maxAge: 0});
    await ctx.redirect('/');
});
module.exports = router;
