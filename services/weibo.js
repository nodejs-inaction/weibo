const sequelize = require('../shared/sequelize');
const PublishType = require('../models/weibo').PublishType;
const Weibo = sequelize.import('../models/weibo');
const User = sequelize.import('../models/user');
const Comment = sequelize.import('../models/comment');
// 发表微博
exports.publish = async function (userId, content) {
    return Weibo.create({
        userId,
        type: PublishType.Self,
        content
    });
};
// 转发微博
exports.share = async function (userId, weiboId, shareContent) {
    const weibo = await Weibo.findByPk(weiboId);
    if (weibo === null) {
        throw  new Error('转发的微博不存在');
    }
    if (weibo.userId === userId) {
        throw new Error('不能转发自己的微博');
    }

    return sequelize.transaction(async (transaction) => {
        const newWeibo = await Weibo.create({
            userId,
            content: weibo.content,
            shareContent,
            type: PublishType.Share,
        }, {transaction});
        // 更新源微博的分享数
        weibo.shareCount++;
        await weibo.save({transaction});
        return newWeibo;
    });
};

// 查询一条微博
exports.show = async function (id, withUser = false) {
    const options = {};
    if (withUser) {
        options.include = [{
            model: User,
            as: 'user'
        }];
    }
    return Weibo.findByPk(id, options);
};

// 所有微博列表
exports.list = async function (page = 1, size = 10) {
    return Weibo.findAndCountAll({
        limit: size,
        offset: (page - 1) * size,
        order: [['id', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['id', 'nickname'],
                as: 'user'
            },
        ]
    });
};

// 用户发表的微博列表
exports.listByUser = async function (userId, page = 1, size = 10) {
    return Weibo.findAndCountAll({
        where: {userId},
        limit: size,
        offset: (page - 1) * size,
        order: [['id', 'DESC']],
    });
};

// 编辑微博
exports.update = async function (id, userId, content) {
    const weibo = await Weibo.findByPk(id);
    if (weibo === null || weibo.userId !== userId) {
        throw new Error('您无权编辑该微博');
    }
    if (weibo.type !== PublishType.Self) {
        throw new Error('只能编辑自己发布的微博');
    }

    weibo.content = content;
    return weibo.save();
};
// 删除微博
exports.destroy = async function (id, userId) {
    const weibo = await Weibo.findByPk(id);
    if (weibo === null || weibo.userId !== userId) {
        throw new Error('您无权删除该微博');
    }
    return weibo.destroy();
};
