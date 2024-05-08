# 基本用途
## 总有一些鸡肋的图片，无论是本地的还是网络上的，需要找一个树洞扔进去；
## 然后，就只需要备份一下网络URL地址了
## 图床是https://telegra.ph
## 使用D1数据库

## 其实，数据库存储的就是一些文本字符串，任意文本也是可用扔进树洞里面。

# 简单的建立步骤：
## 1、CF上创建一个数据库；
## 2、在数据库的控制台上添加全局存储表：
    CREATE TABLE IF NOT EXISTS webphonstore_all ( ad_name TEXT UNIQUE, imgURL TEXT, udatatime TIMESTAMP DEFAULT CURRENT_TIMESTAMP )
  添加设置ad_name为唯一约束;
## 3、CF上创建pages，连接包本项目；
## 4、将pages连接到数据库，环境变量为 webpho_db;
## 5、重建部署；

  
