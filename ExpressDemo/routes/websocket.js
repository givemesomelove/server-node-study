const { WebSocket } = require("ws");
const { wsAuth } = require("../middleware/auth");

function setupWebSocket(server) {
    wss = new WebSocket.Server({ noServer: true }); // 修改此处

  // 鉴权
  server.on("upgrade", async (req, socket, head) => {
    try {
        const authPassed = await wsAuth(req, socket);
        if (authPassed) {
            wss.handleUpgrade(req, socket, head, (ws) => {
                wss.emit("connection", ws, req);
            });
        } else {
            console.error("WebSocket鉴权失败");
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
        }
    } catch (err) {
        console.error("WebSocket鉴权失败", err);
        socket.write('HTTP/1.1 500 Internal Server Error\r\n\r\n');
        socket.destroy();
    }
  });

  wss.on("connection", (ws) => {
    console.log("新的WebSocket连接建立");

    /// 收到消息
    ws.on("message", (message) => {
      console.log("收到消息:", message.toString());

      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message.toString());
        }
      });
    });

    /// 连接断开
    ws.on("close", () => {
      console.log("连接关闭");
    });
  });

  return wss;
}

module.exports = setupWebSocket;
