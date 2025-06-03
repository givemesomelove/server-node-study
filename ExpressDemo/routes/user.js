const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { httpAuth } = require('../middleware/auth');

/// 用户注册
router.post('/register', async (req, res) => {
    try {
        /// 判空
        const { username, password } = req.body;
        if (!username || !password) throw new Error('用户名或密码不能为空');

        /// 校验用户名是否存在
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) throw new Error('用户名已存在');

        /// 新用户入库
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/// 用户登录（生成 JWT）
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        /// 判空
        if (!username || !password) throw new Error('用户名或密码不能为空');

        /// 校验用户名是否存在
        const user = await User.scope('withPassword').findOne({ where: { username } });
        if (!user) throw new Error('用户不存在');

        /// 密码是否正确
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error('密码错误');

        /// 生成 JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/// 获取用户信息(需认证)
router.get('/userInfo', httpAuth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.json(user);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

/// 注销当前账号(需认证)
router.post('/resign', httpAuth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) throw new Error('用户不存在');

        /// 删除用户
        await user.destroy();
        res.json({ message: '用户已删除' });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

module.exports = router;