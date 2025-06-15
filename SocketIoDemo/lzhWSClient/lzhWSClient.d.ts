
export interface LzhWSClient {
    /**
     * 建立与指定 URL 的连接。
     * 该方法用于初始化或重新建立与服务器的连接，调用后会尝试连接到传入的 URL。
     * @param url - 要连接的服务器的 URL 地址，使用原生 JavaScript 的 String 类型。
     */
    connect(url: String): void;

    /**
     * 注册一个事件处理器，用于监听特定路径的事件。
     * 当服务器发送与指定路径匹配的事件时，关联的处理函数将被调用。
     * @param path - 要监听的事件路径，使用原生 JavaScript 的 String 类型，用于标识不同的事件。
     * @param handler - 处理该事件的函数，当匹配到对应路径的事件时会被调用。
     */
    on(path: String, handler: function): void;

    /**
     * 初始化路由映射的方法。此方法为一个基础实现，主要用于提示开发者重写该方法。
     * 在实际使用中，开发者应重写此方法，在其中注册具体的路由处理器到 this.routers 中。
     */
    initRouterMap(): void;
}

module.exports = LzhWSClient;