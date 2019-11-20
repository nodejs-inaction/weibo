// 关注
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.import('./user');

    class Follow extends Model {
    }

    // 模型定义
    Follow.init({
        senderId: {type: DataTypes.INTEGER, allowNull: false, comment: '关注人ID'}, // 同名unique将创建联合索引
        receiverId: {type: DataTypes.INTEGER, allowNull: false, comment: '被关注人ID'}
    }, {
        sequelize: sequelize,
        tableName: 'follow',
        underscored: true,
        paranoid: true,
        indexes: [
            {
                name: 'idx_sender',
                fields: ['sender_id']
            },
            {
                name: 'idx_receiver',
                fields: ['receiver_id']
            }
        ]
    });

    Follow.afterCreate(async (follow) => {
        await Promise.all([
            User.increment({subscriberCount: 1}, {where: {id: follow.senderId}}), // 发出关注动作的用户关注人数+1
            User.increment({followerCount: 1}, {where: {id: follow.receiverId}}), // 接收关注动作的用户粉丝+1
        ])
    });

    Follow.afterDestroy(async (follow) => {
        await Promise.all([
            User.increment({subscriberCount: -1}, {where: {id: follow.senderId}}), // 发出关注动作的用户关注人数-1
            User.increment({followerCount: -1}, {where: {id: follow.receiverId}}), // 接收关注动作的用户粉丝-1
        ])
    });
    return Follow;
};
