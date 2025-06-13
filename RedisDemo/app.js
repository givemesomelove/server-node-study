
const roomManager = require('./roomManager');
(async () => {
    await roomManager.connect();

    await roomManager.clearAllRooms();

    /// 创建房间
    const ownerData = { 
        id: "112233445566",
        name: "Alice",
        avatar: 0,
        level: 1,
     }
    const roomId = await roomManager.createRoom(ownerData);
    
    /// 打印房间列表和房间玩家列表
    await roomManager.printAll();
    
    /// 玩家加入房间
    const playerData = { 
        id: "123456789012",
        name: "Bob",
        avatar: 1,
        level: 2,
     }
    await roomManager.joinRoom(roomId, playerData);
 
    /// 打印房间列表和房间玩家列表
    await roomManager.printAll();
})();