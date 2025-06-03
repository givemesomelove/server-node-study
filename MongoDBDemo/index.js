const mongodb = require('mongodb');
/// 连接localhost:27017
const client = new mongodb.MongoClient('mongodb://localhost:27017');
/// 连接数据库
const db = client.db('demo');
/// 连接集合
const collection = db.collection('test');

client.connect().then(() => {
    console.log('连接成功');
})

/// 新加一条数据
collection.insertOne({
    name: '张三',
    age: 20
}).then(() => {
    console.log('添加成功');
})