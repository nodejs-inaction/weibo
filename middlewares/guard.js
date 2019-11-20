// 登录守卫，未登录用户将直接重定向到登录页
module.exports = async function (ctx, next) {
    if (!ctx.state.userId) {
        await ctx.redirect('/user/login');
        return;
    }
    await next();
};
