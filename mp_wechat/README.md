## 微信公众号历史发表文章爬取工具

## 使用方法

### 1. 修改配置文件

```toml
[basic]
# 基础配置
# 读取微信公众号爬虫cookie
cookie = ""
# 设置爬取公众号的ID
fakeid = ""
# 设置需要查询的关键词 搜索全部为空
query = ""
# 设置查询公众号Token 定期需要获取
token = ""

```

#### 参数说明

- cookie: 微信公众号爬虫cookie
> - 登录微信公众平台 https://mp.weixin.qq.com/
> - 使用一个有微信公众号的账号登录
> - 打开开发者工具
> - 查看任意微信公众号链接查看请求表头的Cookie字段
- fakeid: 需要爬取的公众号ID
> - 打开任意微信公众号文章链接
> - 查看链接 https://mp.weixin.qq.com/mp/appmsg_comment 中的携带请求体：_biz
- query: 需要查询的关键词（为空即可）
- token: 查询公众号Token 定期需要获取
> - 登录微信公众平台 https://mp.weixin.qq.com/
> - 查看公众号管理页面 https://mp.weixin.qq.com/cgi-bin/home?t=home/index&lang=zh_CN&token=xxxxxx
> - 查看请求表头的Token字段

### 2. 运行脚本
