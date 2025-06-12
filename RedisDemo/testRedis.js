const redis = require('redis');

class StudyRedis {
    constructor() {
        this.client = redis.createClient({url: 'redis://127.0.0.1:6379'});

        this.client.on('error', (err) => {
            console.error("studyRedis错误:", err);
        });

        this.client.on('ready', () => {
            console.log("studyRedis连接成功");
        });
    }

    /// 单例模式
    static getInstance() {
        if (!StudyRedis.instance) {
            StudyRedis.instance = new StudyRedis();
        }
        return StudyRedis.instance;
    }

    /// 连接
    async connect() {
        this.client.connect();
    }

    /// 测试各功能
    async test() {
        try {
            /// 字符串操作
            await this.client.set("name", "RedisDemo");
            const name = await this.client.get("name");
            console.log("获取字符串:", name);

            /// 哈希操作
            await this.client.hSet("user:1001", {name: "John", age: 30});
            const user = await this.client.hGetAll("user:1001");
            console.log("哈希获取:", user);

            /// 列表操作
            await this.client.lPush("tasks", "task1", "task2");
            const tasks = await this.client.lRange("tasks", 0, -1);
            console.log("列表获取:", tasks);

            /// 集合操作
            await this.client.sAdd("tags", "nodejs", "redis", "database");
            const tags = await this.client.sMembers("tags");
            console.log("集合获取:", tags);

            /// 设置过期时间
            await this.client.set("tempKey", "will expire", 'EX', 10);
            console.log("已经设置过期时间");

        } catch (err) {
            console.error("操作失败:", err);
        } finally {
            /// 关闭连接
            this.client.quit();
        }
    }

    async testObj () {
        const obj = {name: "John", age: 30};
        await this.client.hSet("user:1001", JSON.stringify(obj));

        const jsonStr = await this.client.hGetAll("user:1001");
        const user = JSON.parse(jsonStr);
        console.log("哈希获取对象:", user);
    }
}

module.exports = StudyRedis.getInstance();
