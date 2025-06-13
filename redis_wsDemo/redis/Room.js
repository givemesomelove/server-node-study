const baseRedis = require('./BaseRedis')

const createRoomKey = (roomId) => {
    return "room:" + roomId;
};

const createRoomPlayersKey = (roomId) => {
    return "room_players:" + roomId;
};

class RoomRedis {
    constructor() {
        this.client = baseRedis.client;
    }

    /// 单例模式
    static getInstance() {
        if (!RoomRedis.instance) {
            RoomRedis.instance = new RoomRedis();
        }
        return RoomRedis.instance;
    }

    /// 存房间信息
    async setRoom(key, room) {
        return await this.client.hSet(key, room);
    }

    /// 获取房间信息
    async getRoom(key) {
        return await this.client.hGetAll(key);
    }

    /// 批量获取房间信息
    async getRooms(keys) {
        if (!keys) keys = await this.client.keys("room:*");

        const multi = this.client.multi();
        keys.forEach((key) => {
            multi.hGetAll(key);
        })
        const results = await multi.exec();
        return results;
    }

    /// 存房间玩家信息
    async setRoomPlayers(key, players) {
        return await this.client.set(key, JSON.stringify(players));
    }

    /// 获取房间玩家信息
    async getRoomPlayer(key) {
        const playersJson = await this.client.get(key);
        const roomPlayer = JSON.parse(playersJson);
        return roomPlayer;
    }

    /// 批量获取房间玩家信息
    async getRoomPlayers(keys) {
        if (!keys) keys = await this.client.keys("room_players:*");

        let players = [];
        for (const key of keys) {
            const player = await this.getRoomPlayer(key);
            players.push(player);
        }
        return players;
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
        await this.setRoom(roomKey, roomData);

        /// 房间玩家相关
        const roomPlayersKey = createRoomPlayersKey(roomId);
        ownerData = { ...ownerData, ready: false };
        await this.setRoomPlayers(roomPlayersKey, [ownerData]);

        return roomData;
    }

    /// 玩家加入房间
    async joinRoom(roomId, playerData) {
        if (!roomId || !playerData) throw new Error("房间id或玩家信息异常");

        /// 获取房间信息
        const roomKey = createRoomKey(roomId);

        const room = await this.getRoom(roomKey);
        if (!room) {
            throw new Error("房间不存在");
        }
        /// 获取房间玩家列表
        const roomPlayersKey = createRoomPlayersKey(roomId);
        const players = await this.getRoomPlayer(roomPlayersKey);
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
        await this.setRoomPlayers(roomPlayersKey, players);

        return;
    }

    /// 清空当前所有房间
    async clearAllRooms() {
        const keys = await this.client.keys("room:*");
        const multi = this.client.multi();
        keys.forEach((key) => {
            multi.del(key);
        });
        const playerKeys = await this.client.keys("room_players:*");
        playerKeys.forEach((key) => {
            multi.del(key);
        });
        await multi.exec();
    }

    /// 获取房间信息列表
    async getRoomList() {
        return await this.getRooms();
    }

    /// 获取房间玩家列表
    async getRoomPlayerList() {
        return await this.getRoomPlayers();
    }

    /// 打印所有redis信息
    async printAll() {
        const roomList = await this.getRoomList();
        console.log("房间列表:", roomList);
        const roomPlayers = await this.getRoomPlayers();
        console.log("房间玩家列表:", roomPlayers);
    }
}

module.exports = RoomRedis.getInstance();
