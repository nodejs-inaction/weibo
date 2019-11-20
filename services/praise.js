// 点赞微博
const sequelize = require('../shared/sequelize');
const weiboService = require('./weibo');
const Praise = sequelize.import('../models/praise');

// 点赞
exports.praise = async function (weiboId, userId) {
    const praise = Praise.findOne({
        where: {weiboId, userId}
    });
    if (praise !== null) {
        throw new Error('你已经赞过啦!');
    }
    const weibo = await weiboService.show(weiboId);
    if (weibo === null) {
        throw new Error('微博不存在');
    }
    return Praise.create({
        weiboId,
        userId
    });
};
// 取消点赞
exports.cancelPraise = async function (weiboId, userId) {
    return Praise.destroy({
        where: {weiboId, userId}
    });
};

