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
    this.subscriber = redis.createClient({ url: "redis://127.0.0.1:6379" });
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
    this.client.on("error", (err) => {
      console.error("RoomRedis错误:", err);
    });

    this.client.on("ready", () => {
      console.log("RoomRedis连接成功");
    });
    await this.client.connect();
  }

  /// 初始化并连接subscriber
  async subscriberConnect() {
    this.subscriber.on("error", (err) => {
      console.error("RoomRedis订阅错误:", err);
    });

    this.subscriber.on("ready", () => {
      console.log("RoomRedis订阅连接成功");
    });

    this.subscriber.on("message", (channel, message) => {
      console.log(`RoomRedis订阅收到 ${channel}消息: ${message}`);
    });
    this.subscriber.subscribe("room_updates");

    await this.subscriber.connect();
  }

  /// 连接
  async connect() {
    await this.clientConnect();
    await this.subscriberConnect();
  }

  /// 创建房间
  async createRoom(ownerData) {
    if (!ownerData) throw new Error("房主信息异常");

    /// 房间相关
    const makeRoomData = (ownerId) => {
      /// 根据房主id与当前时间生成id
      const roomId = `${Date.now()}_${ownerId}`;
      /// 根据roomid生成房间key
      const roomKey = createRoomKey(roomId);
      /// 房间数据
      const roomData = {
        roomId,
        ownerId,
        name: "新房间",
        description: "这是一个新创建的房间",
        game: 0,
        password: "",
        maxPlayers: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { roomKey, roomId, roomData };
    };
    /// 房间玩家相关
    const makeRoomPlayersData = (roomId, playerData) => {
      /// 房间玩家key
      const roomPlayersKey = createRoomPlayersKey(roomId);
      /// 房间玩家数据
      playerData = { ...playerData, ready: false };
      const roomPlayersData = {
        players: [playerData],
      };
      return { roomPlayersKey, roomPlayersData };
    };

    const { roomKey, roomId, roomData } = makeRoomData(ownerData.id);
    const { roomPlayersKey, roomPlayersData } = makeRoomPlayersData(
      roomId,
      ownerData
    );

    const multi = this.client.multi();
    multi.hSet(roomKey, "data", JSON.stringify(roomData)).hSet(roomPlayersKey,  "data", JSON.stringify(roomPlayersData));
    await multi.exec();
    return roomId;
  }

  /// 玩家加入房间
  async joinRoom(roomId, playerData) {
    if (!roomId || !playerData) throw new Error("房间id或玩家信息异常");

    /// 获取房间信息
    const roomKey = createRoomKey(roomId);
    const roomJson = await this.client.hGetAll(roomKey);
    if (!roomJson) {
      throw new Error("房间不存在");
    }
    /// 获取房间玩家列表
    const roomPlayersKey = createRoomPlayersKey(roomId);
    const roomPlayersJson = await this.client.hGetAll(roomPlayersKey);
    if (!roomPlayersJson) {
      throw new Error("房间玩家不存在");
    }

    const roomData = JSON.parse(roomJson.data);
    const roomPlayersData = JSON.parse(roomPlayersJson.data);

    /// 是否超过最大房间人数
    const maxPlayers = parseInt(roomData.maxPlayers, 10);
    const playerCount = roomPlayersData.players.length || 0;
    if (playerCount >= maxPlayers) throw new Error("房间已满，无法加入");

    /// 加入房间
    playerData = { ...playerData, ready: false };
    roomPlayersData.players.push(playerData);

    return await this.client.hSet(roomPlayersKey,  "data", JSON.stringify(roomPlayersData));
  }

  /// 获取房间信息列表
  async getRoomList() {
    const keys = await this.client.keys("room:*");
    const pipeline = this.client.multi();

    keys.forEach((key) => {
      pipeline.hGetAll(key);
    });

    const results = await pipeline.exec();
    return results.map((res) => {
        return JSON.parse(res.data);;
    });
  }

  /// 获取房间玩家列表
  async getRoomPlayers() {
    const keys = await this.client.keys("room_players:*");
    const pipeline = this.client.multi();
    keys.forEach((key) => {
      pipeline.hGetAll(key);
    });
    const results = await pipeline.exec();
    return results.map((res) => {
        return JSON.parse(res.data);;
    });
  }

  /// 打印所有redis信息
  async printAll() {
    const roomList = await this.getRoomList();
    const roomPlayers = await this.getRoomPlayers();
    console.log("房间列表:", roomList);
    console.log("房间玩家列表:", roomPlayers);
  }
}

module.exports = RoomRedis.getInstance();
