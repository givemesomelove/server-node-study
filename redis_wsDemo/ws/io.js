const { Server } = require('socket.io')

const roomServer = require('../wsServer/roomServer');

const initIO = (httpServer) => {
    /// 创建io实例
    const io = new Server(httpServer, {
        cors: { origin: '*' },
    });

    const chatSpace = io.of("/chat");
    const roomSpace = io.of("/room");

    // 增强日志
    io.engine.on("connection", (socket) => {
        console.log("[日志] 新传输连接:", socket.id);
    });

    io.on('connection', (socket) => {
        console.log('用户连接到默认命名空间了');
    })

    chatSpace.on('connection', (socket) => {
        console.log("用户连接到聊天室");

        socket.on("message", (msg) => {
            chatSpace.emit("message", `聊天室消息：${msg}`);
        });

        socket.on("disconnect", () => {
            console.log("用户断开了聊天室连接");
        });
    });

    roomSpace.on('connection', (socket) => {
        console.log("用户连接到房间");

        socket.on("message", async (message, block) => {
            const response = await roomServer.handleMessage(socket, message);
            block(response);
        });

        socket.on("disconnect", () => {
            console.log("用户断开了房间连接");
        });
    });

    roomServer.space = roomSpace;
}

module.exports = initIO;