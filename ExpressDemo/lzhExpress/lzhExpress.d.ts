export interface LzhExpress {

    /**
     * 向应用程序添加一个新的路由器。
     * @param path - 路由器的基础路径。
     * @param router - 包含路由定义的路由器对象。
     * @returns 表示操作结果的任意值。
     */
    addRouter(path: String, router: any): void;

    /**
     * 在指定路径添加 WebSocket 支持。
     * @param path - 建立 WebSocket 连接的路径。
     * @returns 表示操作结果的任意值。
     */
    addWs(path: String): any;

    /**
     * 启动服务器并监听指定端口。
     * @param port - 服务器监听的端口号。
     * @returns 表示操作结果的任意值。
     */
    listen(port: number): any;
}