// 评论
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Weibo = sequelize.import('./weibo');
    const User = sequelize.import('./user');

    class Comment extends Model {
    }

    // 模型定义
    Comment.init({
        content: {type: DataTypes.STRING(140), allowNull: false, comment: '评论内容'}
    }, {
        sequelize: sequelize,
        tableName: 'comment',
        underscored: true,
        paranoid: true
    });
    // 关联定义
    Comment.belongsTo(Weibo, { // 评论属于微博
        constraints: false
    });
    Comment.belongsTo(User, { // 评论属于用户
        constraints: false,
    });

    Comment.afterSave(async (comment) => {
        // 微博评论数+1
        await Weibo.increment({commentCount: 1}, {where: {id: comment.weiboId}});
    });
    Comment.afterDestroy(async (comment) => {
        // 微博评论数-1
        await Weibo.increment({commentCount: -1}, {where: {id: comment.weiboId}});
    });
    return Comment;
};

