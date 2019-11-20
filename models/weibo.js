// 微博
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.import('./user');

    class Weibo extends Model {
    }

    // 关联定义
    Weibo.init({
        type: {type: DataTypes.TINYINT, allowNull: false, comment: '发布类型'},
        content: {type: DataTypes.STRING(140), allowNull: false, comment: '微博内容'},
        shareContent: {type: DataTypes.STRING(140), comment: '转发语'},
        praiseCount: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, comment: '点赞数'},
        commentCount: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, comment: '评论数'},
        shareCount: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, comment: '转发数'}
    }, {
        sequelize: sequelize,
        tableName: 'weibo',
        underscored: true,
        paranoid: true
    });

    Weibo.belongsTo(User, {
        constraints: false,
        foreignKey: 'userId',
        as: 'user'
    });

    Weibo.afterCreate(async (weibo) => {
        // 微博数+1
        await User.increment({weiboCount: 1}, {where: {id: weibo.userId}});
    });
    Weibo.afterDestroy(async (weibo) => {
        // 微博数-1
        await User.increment({weiboCount: -1}, {where: {id: weibo.userId}});
    });
    return Weibo;
};

module.exports.PublishType = {
    Self: 1, // 自己发布
    Share: 2 // 转发
};
