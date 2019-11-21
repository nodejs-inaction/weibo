// 评论微博
const sequelize = require('../shared/sequelize');
const weiboService = require('./weibo');
const Comment = sequelize.import('../models/comment');
const User = sequelize.import('../models/user');

// 评论微博
exports.publish = async function (weiboId, userId, content) {
    const weibo = await weiboService.show(weiboId);
    if (weibo === null) {
        throw new Error('微博不存在');
    }
    return Comment.create({
        content,
        weiboId,
        userId
    });
};
// 删除评论
exports.destroy = async function (commentId, userId) {
    const comment = await Comment.findByPk(commentId);
    if (comment === null || comment.userId !== userId) {
        throw new Error('你无权删除该评论');
    }
    return comment.destroy();
};
// 查看微博的评论列表
exports.listByWeibo = async function (weiboId, page, size) {
    return Comment.findAndCountAll({
        where: {weiboId},
        include: [{
            model: User,
            attributes: ['id', 'nickname'],
            as: 'user'
        }],
        offset: (page - 1) * size,
        limit: size,
        order: [['id', 'DESC']]
    });
};
