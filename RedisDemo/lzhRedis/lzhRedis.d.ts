export interface LzhRedis {

    /**
     * Redis 客户端实例
     */
    client: any;

    /**
     * 连接到 Redis 服务器
     * @param url - 服务器地址：端口
     * @returns 一个 Promise，表示连接操作完成
     */
    connect(url: String): Promise<void>;

    /**
     * 存储对象或数组
     * @param key - Redis 键
     * @param obj - 要存储的对象或数组
     * @returns 一个 Promise，表示操作完成
     */
    setObject(key: String, obj: Object | Array<any>): Promise<void>;

    /**
     * 获取对象或数组
     * @param key - Redis 键
     * @returns 一个 Promise，解析为存储的对象或数组
     */
    getObject(key: String): Promise<Object | Array<any>>;

    /**
     * 批量获取对象或数组
     * @param key - Redis 键的前缀，包含这个前缀的都行
     * @returns 一个 Promise，解析为包含对象的数组
     */
    getBatchObject(key: String): Promise<Array<any>>;

    /**
     * 删除单个对象
     * @param key - Redis 键，用于标识存储的对象
     * @returns 一个 Promise，表示删除操作完成
     */
    removeObject(key: String): Promise<void>;

    /**
     * 批量删除对象
     * @param key - Redis 键的前缀，包含这个前缀的都行
     * @returns 一个 Promise，表示批量删除操作完成
     */
    removeBatchObject(key: String): Promise<void>;
}
