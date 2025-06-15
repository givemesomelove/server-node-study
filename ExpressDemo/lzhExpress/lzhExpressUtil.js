const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/// 判断字符串是否为空
const isStrValid = (str) => {
    return typeof str === "string" && str.trim() !== "";
};

/**
 * 包装异步处理函数以捕获错误并返回标准化的响应。
 * @param {Function} handler - 异步处理函数，接收 (req, res) 参数。
 * @returns {Function} 包装后的异步函数，自动处理错误并返回 JSON 格式的错误信息。
 */
const asyncWrap = (handler) => async (req, res) => {
    try {
        const data = await handler(req) || {};
        res.status(201).json(data);
    } catch (err) {
        const status = err.status || 400;
        res.status(status).json({ error: err.message });
    }
};

/**
 * 异步生成密码的哈希值。
 * @param {string} password - 需要加密的密码字符串。
 * @throws {Error} 如果密码为空或无效，将抛出错误。
 * @returns {Promise<string>} 返回加密后的密码哈希值。
 */
const hashPassword = async (password) => {
    if (!isStrValid(password)) throw new Error("密码不能为空");
    return await bcrypt.hash(password, 10);
}

/**
 * 异步比较两个密码是否匹配。
 * @param {string} pw1 - 用户输入的密码。
 * @param {string} pw2 - 加密后的密码。
 * @returns {Promise<boolean>} 返回密码是否匹配的布尔值。
 */
const isPasswordMatch = async (pw1, pw2) => {
    const isMatch = await bcrypt.compare(pw1, pw2);
    return isMatch;
};

/**
 * 生成用户的 JWT 令牌，24小时过期。
 * @param {string} userId - 用户的唯一标识符。
 * @returns {string} 返回生成的 JWT 令牌。
 */
const getToken = (userId) => {
    const token = jwt.sign({ userId }, "LzhSecretKey", {
        expiresIn: "24h",
    });
    return token;
};

/**
 * 验证 JWT 令牌的有效性。
 * @param {string} token - 要验证的 JWT 令牌。
 * @returns {Object} 返回解码后的令牌数据。
 * @throws {Error} 如果令牌无效或过期，将抛出错误。
 */
const verifyToken = (token) => {
    return jwt.verify(token, "LzhSecretKey");
};

// 导出所有方法
module.exports = {
    isStrValid,
    asyncWrap,
    isPasswordMatch,
    getToken,
    verifyToken,
    hashPassword,
};
