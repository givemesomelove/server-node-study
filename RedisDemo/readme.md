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



1.1、Windows下Redis的安装
对于 Redis，官方是没有 Windows 版本的。

Windows 版本下载地址：https://github.com/MicrosoftArchive/redis/releases，下载对应版本的 mis 格式安装包：


 开始安装
 
 选择 “同意协议”，点击下一步继续;
 
 选择 “添加Redis目录到环境变量PATH中”，这样方便系统自动识别 Redis 执行文件在哪里;
 
 端口号可保持默认的 6379，并选择防火墙例外，从而保证外部可以正常访问 Redis 服务;
 
 设定最大值为 100M。作为实验和学习，100M 足够了