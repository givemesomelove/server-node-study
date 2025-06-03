const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar: DataTypes.STRING
}, {
    defaultScope: {
        // 默认查询时排除密码字段
        attributes: { exclude: ['password'] }
    },
    scopes: {
        // 显示密码
        withPassword: {
            attributes: {}
        }
    }
});

/// 密码加密钩子
User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

module.exports = User;