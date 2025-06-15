const LzhCollection = require("./lzhDb/lzhCollection")

class User extends LzhCollection {
    async init() {
        try {
            await this.collection.createIndex(
                { username: 1 },
                { unique: true }
            );
            console.log("用户表索引创建成功");
        } catch (err) {
            console.error("用户表索引创建失败:", err);
        }
    }

    async addUser(userData) {
        /// 检查用户名是否已存在
        const existingUser = await this.collection.findOne({
            username: userData.username,
        });
        if (existingUser) throw new Error("用户名已存在");

        /// 插入新用户
        const id = await this.addObj(userData);
        return id;
    }

    async updateUser(userId, userData) {
        if (userData.username) {
            const existingUser = await this.collection.findOne({
                username: userData.username,
            });
            if (existingUser) throw new Error("用户名已存在");
        }

        const id = await this.updateObj(userId, userData);
        return id;
    }

    async deleteUser(userId) {
        return await this.removeObj(userId);
    }

    /// 根据用户id查询用户信息
    async getUserByUserId(userId) {
        /// 检查用户是否存在
        const obj = await this.getObjById(userId);
        return obj;
    }

    /// 根据用户名查询用户信息
    async getUserByUsername(username) {
        /// 检查用户名是否存在
        const user = await this.collection.findOne({ username: username });
        if (!user) throw new Error("用户名不存在");

        // 转换 _id 为字符串
        user._id = dbObjectId2Str(user._id);
        return user;
    }
}

module.exports = User;