// 用户相关业务
const sequelize = require('../shared/sequelize');
const User = sequelize.import('../models/user');

// 注册账号
exports.register = async function (username, password) {
    const user = await User.findOne({
        where: {username},
    });
    if (user !== null) {
        throw new Error("账号已存在");
    }
    return User.create({
        username,
        password
    });
};
// 登录
exports.login = async function username(username, password) {
    const user = await User.findOne({
        where: {username}
    });
    if (user === null || !user.checkPassword(password)) {
        throw new Error('账号或密码错误');
    }
    return user;
};
// 查看用户信息
exports.show = function (userId) {
    return User.findByPk(userId, {
        attributes: ['id', 'nickname', 'subscriber_count', 'follower_count', 'weibo_count']
    });
};
// 修改个人资料
exports.changeProfile = function (userId, nickname, password) {
    return User.update({nickname, password: password || ''}, {where: {id: userId}, individualHooks: true});
};
