// 微博
const Router = require('koa-router');
const weiboService = require('../services/weibo');
const commentService = require('../services/comment');
const guard = require('../middlewares/guard');
const router = new Router({prefix: '/weibo'});

router.post('/publish', guard, async (ctx) => {
    const {content} = ctx.request.body;
    if (!content) {
        throw new Error('微博内容不能为空');
    }
    if (content.length > 140) {
        throw new Error('微博最大140字');
    }
    await weiboService.publish(ctx.state.userId, content);
    await ctx.redirect('back');
});

router.get('/edit/:id', guard, async (ctx) => {
    const weibo = await weiboService.show(ctx.params.id);
    if (!weibo || weibo.userId !== ctx.state.userId) {
        throw new Error('微博不存在');
    }
    await ctx.render('weibo/edit', {
        weibo
    });
});

router.post('/edit/:id', guard, async (ctx) => {
    const {content} = ctx.request.body;
    if (!content) {
        throw new Error('微博内容不能为空');
    }
    if (content.length > 140) {
        throw new Error('微博最长140字');
    }
    await weiboService.update(ctx.params.id, ctx.state.userId, content);
    await ctx.redirect('back');
});

router.get('/delete/:id', guard, async (ctx) => {
    await weiboService.destroy(ctx.params.id, ctx.state.userId);
    await ctx.redirect('back');
});

router.get('/show/:id', async (ctx) => {
    let {page = 1, size = 10} = ctx.query;
    page = Number(page);
    size = Number(size);
    // 读取微博
    const weiboId = ctx.params.id;
    const weibo = await weiboService.show(weiboId, true);
    if (!weibo) {
        throw new Error('微博不存在');
    }
    // 读取评论
    const {rows: comments, count} = await commentService.listByWeibo(weiboId, page, size);
    await ctx.render('weibo/show', {
        weibo,
        comments,
        count,
        page,
        size
    });
});

router.post('/comment/:id', guard, async (ctx) => {
    const {content} = ctx.request.body;
    if (!content || content.length > 140) {
        throw new Error('评论内容长度不合法');
    }

    const weiboId = ctx.params.id;
    const weibo = await weiboService.show(weiboId);
    if (!weibo) {
        throw new Error('微博不存在');
    }
    await commentService.publish(weiboId, ctx.state.userId, content);
    await ctx.redirect('back');
});

module.exports = router;
