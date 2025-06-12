const redis = require("redis");

const createRoomKey = (roomId) => {
    return "room:" + roomId;
};

const createRoomPlayersKey = (roomId) => {
    return "room_players:" + roomId;
};

class RoomRedis {
    constructor() {
        this.client = redis.createClient({ url: "redis://127.0.0.1:6379" });
        this.subscriber = this.client.duplicate();
    }

    /// 单例模式
    static getInstance() {
        if (!RoomRedis.instance) {
            RoomRedis.instance = new RoomRedis();
        }
        return RoomRedis.instance;
    }

    /// 初始化并连接client
    async clientConnect() {
        this.client.on("error", err => {
            console.error("RoomRedis错误:", err);
        }).on("ready", () => {
            console.log("RoomRedis连接成功");
        });
        await this.client.connect();
    }

    /// 初始化并连接subscriber
    async subscriberConnect() {
        try {
            // 第一步：建立连接
            await this.subscriber.connect();
            console.log("RoomRedis连接成功");

            // 第二步：注册事件监听器
            this.subscriber.on("error", (err) => {
                console.error("RoomRedis订阅错误:", err);
            });

            this.subscriber.on("ready", () => {
                console.log("RoomRedis准备就绪");
            });

            // 第三步：执行订阅
            await this.subscriber.subscribe('room_updates', (message) => {
                console.log(message); // 'message'
            });
            console.log("已订阅 room_updates 频道");

        } catch (err) {
            console.error("RoomRedis初始化失败:", err);
        }
    }

    /// 连接
    async connect() {
        await this.clientConnect();
        await this.subscriberConnect();
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

        return roomId;
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

        /// 广博房间更新
        this.client.publish("room_updates", JSON.stringify({ type: "players", players }));
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
