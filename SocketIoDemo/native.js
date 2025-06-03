const websocket = require("ws");

const initObject = (httpServer) => {
    const wsServer = new websocket.Server({ server: httpServer });

    /// 监听客户端连接事件
    wsServer.on("connection", (ws) => {
        console.log("新用户已连接", ws._socket.remoteAddress);

        ws.on("message", (message) => {
            console.log("收到客户端发来的消息:", message);

            /// 发给其他客户端
            wsServer.clients.forEach(client => {
                if (client.readyState === websocket.OPEN) {
                    client.send(message);
                }
            })
        });

        ws.on('close', () => {
            console.log("用户已断开连接", ws._socket.remoteAddress);
        })
    });
};

module.exports = initObject;