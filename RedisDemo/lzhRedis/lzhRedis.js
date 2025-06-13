const redis = require("redis");

const HASH_ARRAY_KEY = "lzhHArrayKey";

class LzhRedis {
    constructor() {
        this.client = null;
    }

    /// 单例模式
    static getInstance() {
        if (!LzhRedis.instance) {
            LzhRedis.instance = new LzhRedis();
        }
        return LzhRedis.instance;
    }

    async connect(url) {
        this.client = redis.createClient({ url });

        this.client
            .on("error", (err) => {
                console.error("RoomRedis连接错误:", err);
            })
            .on("ready", () => {
                console.log("RoomRedis连接成功");
            });
        await this.client.connect();
    }

    async setObject(key, obj) {
        /// 如果obj是Array
        if (Array.isArray(obj)) {
            await this.client.hSet(key, HASH_ARRAY_KEY, JSON.stringify(obj));
        } else if (typeof obj === "object") {
            // 使用管道(pipeline)批量设置多个字段
            const pipeline = this.client.multi();

            Object.entries(obj).forEach(([field, value]) => {
                // 转换值为字符串
                let strValue;
                if (value === null) {
                    strValue = "null";
                } else if (typeof value === "object") {
                    strValue = JSON.stringify(value);
                } else {
                    strValue = String(value);
                }

                pipeline.hSet(key, field, strValue);
            });

            await pipeline.exec();
        } else {
            console.error("obj 不是对象或数组");
        }
    }

    async getObject(key) {
        const obj = await this.client.hGetAll(key);
        if (obj && Object.prototype.hasOwnProperty.call(obj, HASH_ARRAY_KEY)) {
            /// 数组key
            const objects = JSON.parse(obj[HASH_ARRAY_KEY]);
            return objects;
        }
        return obj;
    }

    async getBatchObject(key) {
        if (!key) return [];

        const keys = await this.client.keys(key + "*");
        const multi = this.client.multi();
        keys.forEach((key) => {
            multi.hGetAll(key);
        });
        const objList = await multi.exec();
        const result = objList.map((obj) => {
            if (
                obj &&
                Object.prototype.hasOwnProperty.call(obj, HASH_ARRAY_KEY)
            ) {
                /// 数组key
                const objects = JSON.parse(obj[HASH_ARRAY_KEY]);
                return objects;
            }
            return obj;
        });
        return result;
    }

    async removeObject(key) {
        await this.client.del(key);
    }

    async removeBatchObject(key) {
        if (!key) return [];

        const keys = await this.client.keys(key + "*");
        const multi = this.client.multi();

        keys.forEach((key) => {
            multi.del(key);
        });
        await multi.exec();
    }
}

module.exports = LzhRedis.getInstance();
