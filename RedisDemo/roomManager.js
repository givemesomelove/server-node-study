const redis = require("./lzhRedis/lzhRedis");

const createRoomKey = (roomId) => {
    return "room:" + roomId;
};

const createRoomPlayersKey = (roomId) => {
    return "room_players:" + roomId;
};

class RoomRedis {
    constructor() {
        
    }

    /// 单例模式
    static getInstance() {
        if (!RoomRedis.instance) {
            RoomRedis.instance = new RoomRedis();
        }
        return RoomRedis.instance;
    }

    /// 连接
    async connect() {
        await redis.connect('redis://127.0.0.1:6379')
    }

    /// 创建房间
    async createRoom(ownerData) {
        if (!ownerData) throw new Error("房主信息异常");

        const roomId = Date.now() + "_" + ownerData.id;
        const roomKey = createRoomKey(roomId);
        /// 房间数据
        const roomData = {
            roomId,
            ownerId: ownerData.id,
            name: "新房间",
            description: "这是一个新创建的房间",
            game: 0,
            password: "",
            maxPlayers: 8,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        await redis.setObject(roomKey, roomData);

        /// 房间玩家相关
        const roomPlayersKey = createRoomPlayersKey(roomId);
        ownerData = { ...ownerData, ready: false };
        await redis.setObject(roomPlayersKey, [ownerData]);

        return roomId;
    }

    /// 玩家加入房间
    async joinRoom(roomId, playerData) {
        if (!roomId || !playerData) throw new Error("房间id或玩家信息异常");

        /// 获取房间信息
        const roomKey = createRoomKey(roomId);

        const room = await redis.getObject(roomKey);
        if (!room) {
            throw new Error("房间不存在");
        }
        /// 获取房间玩家列表
        const roomPlayersKey = createRoomPlayersKey(roomId);
        const players = await redis.getObject(roomPlayersKey);
        if (!players) {
            throw new Error("房间玩家不存在");
        }

        /// 是否超过最大房间人数
        const maxPlayers = parseInt(room.maxPlayers, 10);
        const playerCount = players.length;
        if (playerCount >= maxPlayers) throw new Error("房间已满，无法加入");

        /// 加入房间
        playerData = { ...playerData, ready: false };
        players.push(playerData);
        await redis.setObject(roomPlayersKey, players);
    }

    /// 清空当前所有房间
    async clearAllRooms() {
        await redis.removeBatchObject("room:");
        await redis.removeBatchObject("room_players:")
    }

    /// 获取房间信息列表
    async getRoomList() {
        return await redis.getBatchObject("room:");
    }

    /// 获取房间玩家列表
    async getRoomPlayerList() {
        return await redis.getBatchObject("room_players:");
    }

    /// 打印所有redis信息
    async printAll() {
        const roomList = await this.getRoomList();
        console.log("房间列表:", roomList);
        const roomPlayers = await this.getRoomPlayerList();
        console.log("房间玩家列表:", roomPlayers);
    }
}

module.exports = RoomRedis.getInstance();
