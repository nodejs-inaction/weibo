// 首页
const Router = require('koa-router');
const router = new Router();
const weiboService = require('../services/weibo');

router.get('/', async (ctx) => {
    let {page = 1, size = 10} = ctx.query;
    page = Number(page);
    size = Number(size);
    const {rows, count} = await weiboService.list(page, size);
    await ctx.render('home', {
        list: rows,
        count,
        page: page,
        size: size
    });
});

module.exports = router;
