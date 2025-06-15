const db = require('./lzhDb/lzhDb')
const User = require('./user')

const main = async () => {
    db.setModels([User]);
    await db.connect('mongodb://localhost:27017', "userDemo");

    const userDb = db.collections.user;

    // userDb.addUser({
    //     username: '张三',
    //     password: "123123",
    //     avatar: 0,
    // })

    // userDb.updateUser('684d726e38d9b956d51af358', {
    //     username: '李四'
    // })

    // userDb.deleteUser('684d726e38d9b956d51af358');

    const user = await userDb.getUserByUserId('684d730113f89e33a160a013');
    console.log(user);
}
main();


