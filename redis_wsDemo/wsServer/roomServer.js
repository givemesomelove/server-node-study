const roomRedis = require('../redis/Room');

class RoomServer {
    constructor() {
        this.roomRedis = roomRedis;
        this.space = null;
    }

    /// 单例模式
    static getInstance() {
        if (!RoomServer.instance) {
            RoomServer.instance = new RoomServer();
        }    
        return RoomServer.instance;
    }

    /// 处理房间消息
    async handleMessage(socket, message) {
        const { type, data } = message;
        let response = {};
        switch (type) {
            case 'createRoom':
                response = await this.createRoom(socket, data);
                break;
            case 'joinRoom':
                response = await this.joinRoom(socket, data);
                break;
            case 'getAllRooms':
                response = await this.getAllRooms();
                break;
            case 'clearRooms':
                response = await this.clearRooms();
            default:
                break;
        }
        return response;
    }

    /// 发消息
    sendMessage(roomId, type, data) {
        const message = { type, data };
        this.space.to(roomId).emit('message', message);
    }

    /// 创建房间
    async createRoom(socket, data) {
        try {
            const { userData } = data;
            /// redis新建房间
            const roomData = await this.roomRedis.createRoom(userData);
            /// socket加入房间
            socket.join(roomData.roomId);
            /// 回复创建成功
            return { success: true, data: roomData };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    /// 加入房间
    async joinRoom(socket, data) {
        try {
            const { roomId, userData } = data;
            /// redis加入房间
            await this.roomRedis.joinRoom(roomId, userData);
            /// socket加入房间
            socket.join(roomId);

            this.sendMessage(roomId, 'roomUpdate', {})
            /// 回复加入成功
            return { success: true, data: {roomId} };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    /// 获取所有房间信息
    async getAllRooms() {
        try {
            const roomList = await this.roomRedis.getRoomList();
            const roomPlayerList = await this.roomRedis.getRoomPlayerList();

            const data = { roomList, roomPlayerList };
            return { success: true, data };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async clearRooms() {
        try {
            await this.roomRedis.clearAllRooms();
            this.sendMessage(roomId, 'roomUpdate', {})
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }
}

module.exports = RoomServer.getInstance();
