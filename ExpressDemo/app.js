require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
// const multer = require("multer");
const sequelize = require("./config/database");
const setupWebSocket = require("./routes/websocket");
const http = require("http");

const port = process.env.PORT || 3000;

/// 测试数据库连接
sequelize
  .authenticate()
  .then(() => console.log("数据库连接成功"))
  .catch((err) => console.error("数据库连接失败", err));

/// 自动创建表
sequelize.sync({ force: false });

const app = express();

/// 压缩
app.use(compression());
/// 跨域
app.use(cors());
/// 日志
app.use(morgan("dev"));
/// 静态文件路径
app.use(express.static("public"));
/// 解析 JSON
app.use(express.json());

// 路由
app.use("/users", require("./routes/user"));
app.use("/upload", require("./routes/upload"));
/// websocket
const server = http.createServer(app);
setupWebSocket(server);

// 全局错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "服务器错误" });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`服务器正在运行在 http://localhost:${port}`);
});
