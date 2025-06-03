const express = require('express')
const app = express()

app.get('/', function(req, res) {
    const text = process.env.TEXT || '我是一个测试文本!'
    res.send(text)
})

const port = process.env.PORT || 30000
app.listen(port, function() {
    console.log(`服务器正在运行在 http://localhost:${port}`)
})