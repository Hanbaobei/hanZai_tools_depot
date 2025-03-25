# -*- coding: utf-8 -*-
import csv
import time
import random

import requests
import os
import tomllib


class MpWechat:
    def __init__(self):
        config_path = os.path.join(os.path.dirname(__file__), "config.toml")
        try:
            with open(config_path, "rb") as f:
                config = tomllib.load(f)
                # 读取基本配置
            basic_config = config.get("basic", {})
            # 读取cookie
            self.cookie = basic_config.get("cookie", "")
            # 设置爬取公众号的ID
            self.fakeid = basic_config.get("fakeid", "")
            # 设置查询公众号Token 定期需要获取
            self.token = basic_config.get("token", "")
            # 读取query
            self.query = basic_config.get("query", "")
            # 配置爬取代理
            self.proxies = {"http": "49.68.96.89:8089"}
            self.begin = 0
            # 微信公众号文章列表
            self.DataList = []
        except Exception as e:
            print("读取配置文件失败:", e)
            return

    def getWeChat(self):
        headers = {
            "cookie": self.cookie,
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.51",
        }
        params = {
            "action": "list_ex",
            "begin": self.begin,
            "count": 5,
            "fakeid": self.fakeid,
            "type": 9,
            "query": self.query,
            "token": self.token,
            "lang": "zh_CN",
            "f": "json",
            "ajax": 1,
        }

        url = "https://mp.weixin.qq.com/cgi-bin/appmsg"
        res = requests.get(
            url, headers=headers, params=params, proxies=self.proxies
        ).json()

        # 微信流量控制, 退出
        if res["base_resp"]["ret"] == 200013:
            print("操作过于频繁 {}".format(str(self.begin)))
            return
        elif res["base_resp"]["ret"] == 200003:
            print("token过期 {}".format(str(self.begin)))
            return
        elif res["base_resp"]["ret"] == 0:
            self.getWeChatInfo(res)
        else:
            print("未知错误 {}".format(str(self.begin)))

    def getWeChatInfo(self, res):
        pageNumber = 1
        # 获取总页数
        pageTotal = res["app_msg_cnt"] / 5
        # 文章列表
        DocList = res["app_msg_list"]
        # 获取文章个数
        DocCount = res["app_msg_cnt"]
        print("文章总数为：", DocCount)
        print("进度为：", (self.begin / DocCount) * 100, "%")
        for data in DocList:
            # 文章Id
            a_id = data["aid"]
            # 文章创建时间 a
            datetime = data["create_time"]
            date = time.strftime("%Y-%m-%d", time.localtime(datetime))
            # 文章标题
            title = data["title"]
            # 文章链接
            url = data["link"]
            # 文章封面
            cover = data["cover"]
            self.DataList.append({title, url, date, cover})
            with open(
                    "wechat_official.csv", "a+", encoding="utf-8-sig", newline=""
            ) as f:
                cws = csv.writer(f)
                print("正在添加:", date, title)
                cws.writerow([a_id, date, url, title, cover])
                print("添加成功:", title)
        self.begin += len(DocList)
        pageNumber += 1
        # 随机休眠1-10秒
        time.sleep(random.randint(1, 10))
        # 打印当前页码和剩余页码
        print(
            """开始爬取下一页,总页码:{},当前页码:{},剩余页码{}"""
            .format(pageTotal, pageNumber, pageTotal - pageNumber)
        )
        if self.begin < DocCount:
            self.getWeChat()
        else:
            return


if __name__ == "__main__":
    MpWechat().getWeChat()
