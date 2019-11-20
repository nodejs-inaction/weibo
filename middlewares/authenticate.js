// 用户登录验证
module.exports = async function (ctx, next) {
    ctx.state.userId = Number(ctx.cookies.get('userId', {signed: true}));
    await next();
};
