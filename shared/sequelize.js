// 数据库
const {Sequelize} = require('sequelize');

module.exports = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'weibo',
});
