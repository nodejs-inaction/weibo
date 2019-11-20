// 点赞
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.import('./user');
    const Weibo = sequelize.import('./weibo');

    class Praise extends Model {
    }

    // 模型定义
    Praise.init({
        weiboId: {type: DataTypes.INTEGER, allowNull: false, comment: '微博ID', unique: 'idx_praiser'}, // 同名unique将创建联合索引
        userId: {type: DataTypes.INTEGER, allowNull: false, comment: '用户ID', unique: 'idx_praiser'}
    }, {
        sequelize: sequelize,
        tableName: 'praise',
        underscored: true,
    });
    // 关联定义
    Praise.belongsTo(Weibo, { // 点赞属于微博
        constraints: false
    });
    Praise.belongsTo(User, { // 点赞属于用户
        constraints: false,
    });

    Praise.afterSave(async (praise) => {
        // 微博点赞数+1
        await Weibo.increment({praiseCount: 1}, {where: {id: praise.weiboId}});
    });
    Praise.afterDestroy(async (praise) => {
        // 微博点赞数-1
        await Weibo.increment({praiseCount: -1}, {where: {id: praise.weiboId}});
    });
    return Praise;
};
