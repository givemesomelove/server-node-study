const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const websocket = require("ws");

const app = express();
// 创建http服务器
const httpServer = createServer(app);

/// 使用io.js
// const initObjectIO = require("./io.js");
// initObjectIO(httpServer);

/// 使用native.js
// const initObjectNative = require("./native.js");
// initObjectNative(httpServer);

/// 使用namespaceIO.js
const initObjectNamespaceIO = require("./namespaceIO.js");
initObjectNamespaceIO(httpServer);


const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`服务器运行在http://localhost:${PORT}`);
});
