export interface LzhDb {
    /**
     * 配置数据库模型，连接后会初始化。
     *
     * @param models - 一个包含模型的数组，用于初始化数据库。
     * 每个模型应该是一个对象，包含模型的定义和配置。
     * @returns 一个 Promise，表示初始化操作完成。
     */
    setModels(models: Array<any>): void;

    /**
     * 连接到数据库。
     *
     * @param url - 数据库连接字符串，用于指定数据库的地址和配置。
     * @returns 一个 Promise，表示连接操作完成。
     */
    connect(url: String, dbname: String): Promise<void>;

    /**
     * 断开数据库连接。
     *
     * @returns 一个 Promise，表示断开连接操作完成。
     */
    disconnect(): Promise<void>;
}
