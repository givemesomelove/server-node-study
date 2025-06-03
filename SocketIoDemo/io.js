const { Server } = require("socket.io");

const initObject = (httpServer) => {
    /// 创建 Socket.IO 实例
    const io = new Server(httpServer, {
        cors: { orgin: "*" },
    });

    // 增强日志
    io.engine.on("connection", (socket) => {
        console.log("[日志] 新传输连接:", socket.id);
    });

    /// 鉴权
    // io.use(httpAuth);

    /// 监听客户端连接事件
    io.on("connection", (socket) => {
        console.log("新用户已连接，ID:", socket.id);

        /// 监听客户端发送的消息
        socket.on("message", (msg) => {
            console.log("收到客户端发来的消息：", msg);

            io.emit("message", `服务器已收到消息：${msg}`);
        });

        /// 监听客户端断开连接事件,注意socket.io不是close
        socket.on("disconnect", (socket) => {
            console.log("用户已断开连接，ID:", socket.id);
        });
    });
};

module.exports = initObject;
