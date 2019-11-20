const sequelize = require('../shared/sequelize');
const userService = require('./user');
const Follow = sequelize.import('../models/follow');

// 关注
exports.follow = async function (senderId, receiverId) {
    const user = await userService.show(receiverId);
    if (user === null) {
        throw new Error('关注用户不存在');
    }
    const follow = await Follow.findOne({
        where: {senderId, receiverId}
    });
    if (follow !== null) {
        throw new Error('你已经关注该用户');
    }
    return Follow.create({
        senderId,
        receiverId
    });
};

// 取消关注
exports.cancelFollow = async function (senderId, receiverId) {
    return Follow.destroy({
        where: {senderId, receiverId}
    });
};
