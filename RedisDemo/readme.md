mac 安装Redis：

brew install redis

启动Redis:
 brew services start redis

 停止Redis:
 brew services stop redis
 
 查看Redis是否启动：
 redis-cli ping

 连接Redis：
 redis-cli -h 127.0.0.1 -p 6379