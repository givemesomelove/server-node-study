const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const initIO = require('./ws/io');
const baseReids = require('./redis/BaseRedis');

baseReids.connect();

const app = express();
const httpServer = createServer(app);
initIO(httpServer);

const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`服务器运行在http://localhost:${PORT}`);
});