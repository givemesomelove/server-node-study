const redis = require('redis')

class BaseRedis {
    constructor() {
        this.client = redis.createClient({ url: 'redis://localhost:6379' });
        this.subscriber = this.client.duplicate();
    }

    /// 单例模式
    static getInstance() {
        if (!BaseRedis.instance) {
            BaseRedis.instance = new BaseRedis();
        }   
        return BaseRedis.instance;
    }

    /// 初始化并连接client
    async clientConnect() {
        this.client.on("error", err => {
            console.error("RoomRedis错误:", err);
        }).on("ready", () => {
            console.log("RoomRedis连接成功");
        });
        await this.client.connect();
    }

    /// 初始化并连接subscriber
    async subscriberConnect() {
        try {
            // 第一步：建立连接
            await this.subscriber.connect();
            console.log("RoomRedis连接成功");

            // 第二步：注册事件监听器
            this.subscriber.on("error", (err) => {
                console.error("RoomRedis订阅错误:", err);
            });

            this.subscriber.on("ready", () => {
                console.log("RoomRedis准备就绪");
            });

            // 第三步：执行订阅
            await this.subscriber.subscribe('room_updates', (message) => {
                console.log(message); // 'message'
            });
            console.log("已订阅 room_updates 频道");

        } catch (err) {
            console.error("RoomRedis初始化失败:", err);
        }
    }

    /// 连接
    async connect() {
        await this.clientConnect();
        // await this.subscriberConnect();
    }
}

module.exports = BaseRedis.getInstance();