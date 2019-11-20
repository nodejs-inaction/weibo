// 错误处理器
module.exports = async function (ctx, next) {
    try {
        await next();
    } catch (e) {
        await ctx.render('error', {
            error: e.message,
            title: '错误'
        });
    }
};
