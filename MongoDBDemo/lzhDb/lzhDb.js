const { MongoClient } = require("mongodb");

class LzhDb {
    
    constructor() {
        this.client = null;
        this.db = null;
        this.isConnected = false;
        this.models = [];
        this.collections = {};
    };

    /// 单例模式
    static getInstance() {
        if (!LzhDb.instance) {
            LzhDb.instance = new LzhDb();
        }
        return LzhDb.instance;
    }

    setModels(models) {
        this.models = models;
    };

    async connect(url, dbname) {
        if (this.isConnected) return this.db;

        try {
            console.log("正在连接数据库...");

            this.client = new MongoClient(url, {});

            await this.client.connect();
            this.db = this.client.db(dbname);
            /// 验证连接
            await this.db.command({ ping: 1 });
            this.isConnected = true;
            console.log("数据库连接成功");

            /// 初始化模型
            await this.initModels();

            return this.db;
        } catch (err) {
            console.error("数据库连接失败：", err)
        }
    }

    /// 初始化模型
    async initModels() {
        this.models.forEach((ModelClass) => {
            ///model是类
            const modelInstance = new ModelClass(this.db);
            const key = ModelClass.name.toLowerCase();
            this.collections[key] = modelInstance;  
        })
        console.log("初始化数据库模型完成");
    }

    /// 断开数据库
    async disconnect() {
        if (this.client) {
            await this.client.close();
            this.isConnected = false;
            console.log("数据库连接已断开")
        }
    }
}

module.exports = LzhDb.getInstance();