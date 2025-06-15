const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const http = require("http");
const { Server } = require('socket.io');

class LzhExpress {
    constructor() {
        const app = express();
        app.use(compression());
        app.use(cors());
        app.use(morgan("dev"));
        app.use(express.static("public"));
        app.use(express.json());
        this.app = app;

        this.server = null;
        this.io = null;
    }

    addRouter(path, router) {
        this.app.use(`/${path}`, router);
    }

    addWs(path) {
        if (!this.server) {
            this.server = http.createServer(this.app);
        }
        if (!this.io) {
            this.io = new Server(this.server, {
                cors: { origin: '*' }
            });
        }
        
        const space = this.io.of(`/${path}`);
        return space;
    }

    listen(port) {
        if (this.server) {
            this.server.listen(port, () => {
                console.log(`监听http://localhost:${port}`);
            })
        } else {
            this.app.listen(port, () => {
                console.log(`监听http://localhost:${port}`);
            })
        }
    }
}

module.exports = LzhExpress;
