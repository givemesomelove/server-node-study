
export interface LzhWS {
    /**
     * 向指定客户端发送消息
     * @param {Socket} socket - 客户端套接字对象，用于与特定客户端进行通信
     * @param {string} path - 消息的事件名称，客户端可根据该名称监听消息
     * @param {any} data - 要发送的数据，可以是任意类型
     */
    sendMessage2Client(socket: any, path: String, data: object): void;

    /**
     * 向指定房间内的所有客户端发送消息
     * @param {string} roomId - 房间的 ID，用于指定消息发送的目标房间
     * @param {string} path - 消息的事件名称，客户端可根据该名称监听消息
     * @param {any} data - 要发送的数据，可以是任意类型
     */
    sendMessage2Room(roomId: String, path: String, data: object): void;

    /**
     * 向所有连接的客户端发送消息
     * @param {string} path - 消息的事件名称，客户端可根据该名称监听消息
     * @param {any} data - 要发送的数据，可以是任意类型
     */
    sendMessage2World(path: String, data: object): void;

    /**
     * 设置空间并初始化该空间的连接、消息接收和断开连接事件监听
     * @param {Object} space - 要设置的空间对象，通常是一个具备事件监听能力的对象，如 Socket.IO 的命名空间
     */
    setSpace(space: any): void;

    /**
     * 注册一个路由处理器，将指定路径与对应的处理函数关联起来
     * @param {string} path - 路由路径，用于标识不同的请求
     * @param {Function} handler - 处理该路由的函数，当匹配到对应路径时会被调用
     * @returns {LzhWS} 返回当前实例，支持链式调用
     */
    on(path: String, handler: function): void;

    /**
     * 初始化路由映射的方法。此方法为一个基础实现，主要用于提示开发者重写该方法。
     * 在实际使用中，开发者应重写此方法，在其中注册具体的路由处理器到 this.routers 中。
     */
    initRouterMap(): void;
}