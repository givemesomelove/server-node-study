const { io } = require("socket.io-client");
const readline = require("readline"); // 新增：引入 readline 模块

// 默认命名空间
// const socket = io("ws://localhost:3000", {
//     transports: ["websocket"],
//     reconnection: false,
// });

/// 聊天室
const socket = io("ws://localhost:3000/chat");

/// 房间

socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("message", "Hello from client");
});

socket.on("message", (data) => {
    console.log("Received:", data);
});

socket.on("connect_error", (err) => {
    console.log("Connection failed:", err.message);
    process.exit(1);
});

const cmd = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Enter command: ",
})

cmd.on('line', (input) => {
    if (input === 'send') {
        socket.emit('message', {
            text: "告诉你一件事",
            name: process.env.USERNAME || 'unknown',
        });
    } else if (input === 'leave') {
        socket.disconnect();
        console.log("Disconnected from server");
        return;
    }
})
