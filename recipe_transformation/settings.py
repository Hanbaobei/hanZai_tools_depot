import os

# 获取当前文件的路径
current_file_path = os.path.abspath(__file__)
# 获取当前文件所在文件夹的位置
current_folder_path = os.path.dirname(current_file_path)
connect_file = "sqlite://" + current_folder_path + os.sep + "data" + os.sep + "database.sqlite3"
TORTOISE_ORM = {
    "connections": {
        "default": connect_file
    },
    "apps": {
        "models": {
            "models": ["models.task","models.words", "aerich.models"],
            "default_connection": "default"
        }
    },
    'use_tz': False,
    'timezone': 'Asia/Shanghai'
}
