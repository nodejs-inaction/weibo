// 评论
// 微博
const Router = require('koa-router');
const commentService = require('../services/comment');
const guard = require('../middlewares/guard');
const router = new Router({prefix: '/comment'});

router.get('/delete/:id', guard, async (ctx) => {
    const userId = ctx.state.userId;
    await commentService.destroy(ctx.params.id, userId);
    await ctx.redirect('back');
});

module.exports = router;
