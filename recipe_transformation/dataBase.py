import sqlite3
import uuid  # 新增uuid模块导入
import logging
import os

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)
# 获取当前文件的路径
current_file_path = os.path.abspath(__file__)
# 获取当前文件所在文件夹的位置
current_folder_path = os.path.dirname(current_file_path)


class TranslateDataBase:
    def __init__(self):
        sqlite3.enable_callback_tracebacks(True)

        def sql_trace_callback(query):
            logging.debug(f"Executing SQL: {query}")

        self.conn = sqlite3.connect(
            current_folder_path + os.sep + "data" + os.sep + "translate.db"
        )
        self.conn.set_trace_callback(sql_trace_callback)  # 设置SQL跟踪回调
        self.cursor = self.conn.cursor()
        self.create_table()

    def create_table(self):
        """创建存储菜谱的表格"""
        self.cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS translate (
                id TEXT PRIMARY KEY,
                html TEXT NOT NULL,
                file_name TEXT NOT NULL,
                upload_time DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """
        )
        self.conn.commit()

    def insert_translate(self, html_content, file_name):
        """
        插入新的菜谱记录
        :param html_content: 菜谱HTML内容
        :param file_name: 文件名
        :return: 生成的UUID
        """
        recipe_id = str(uuid.uuid4())
        self.cursor.execute(
            """
            INSERT INTO translate (id, html,file_name)
            VALUES (?, ? , ?)
        """,
            (recipe_id, html_content, file_name),
        )
        self.conn.commit()
        return recipe_id

    def close(self):
        """关闭数据库连接"""
        self.conn.close()

    def get_translate_by_id(self, recipe_id):
        """根据UUID获取菜谱HTML内容"""
        self.cursor.execute(
            """
            SELECT id, html, file_name, upload_time FROM translate 
            WHERE id = ?
        """,
            (recipe_id,),
        )
        result = self.cursor.fetchone()

        if result:
            id = result[0]
            html = result[1]
            file_name = result[2]
            upload_time = result[3]
            return [id, html, file_name, upload_time]
        return None

    def delete_translate_by_id(self, recipe_id):
        """根据UUID删除菜谱记录"""
        self.cursor.execute(
            """
            DELETE FROM translate
            WHERE id =?
        """,
            (recipe_id,),
        )
        self.conn.commit()

    def get_all_translate(self):
        """获取所有菜谱记录"""
        self.cursor.execute("SELECT id, html, file_name, upload_time FROM translate")
        results = self.cursor.fetchall()
        return [
            {
                "id": row[0],
                "html": row[1],
                "file_name": row[2],
                "upload_time": row[3]
            }
            for row in results
        ]


class LexiconDataBase:
    def __init__(self):
        sqlite3.enable_callback_tracebacks(True)

        def sql_trace_callback(query):
            logging.debug(f"Executing SQL: {query}")

        self.conn = sqlite3.connect(
            current_folder_path + os.sep + "data" + os.sep + "lexicon.db"
        )
        self.conn.set_trace_callback(sql_trace_callback)  # 设置SQL跟踪回调
        self.cursor = self.conn.cursor()
        self.create_table()

    def create_table(self):
        """创建存储菜谱的表格"""
        self.cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS lexicon (
                id TEXT PRIMARY KEY,
                item TEXT NOT NULL,
                value TEXT NOT NULL,
                upload_time DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """
        )
        self.conn.commit()

    def insert_lexicon(self, item, value):
        """
        插入新的菜谱记录
        :param item: 中文
        :param value: 英文
        :return:
        """
        lexicon_id = str(uuid.uuid4())
        self.cursor.execute(
            """
            INSERT INTO lexicon (id, item, value)
            VALUES (?, ? , ?)
        """
            , (lexicon_id, item, value))
        self.conn.commit()
        return lexicon_id

    def close(self):
        """关闭数据库连接"""
        self.conn.close()

    def get_lexicon_all(self):
        """获取所有菜谱记录"""
        self.cursor.execute("SELECT * FROM lexicon")
        results = self.cursor.fetchall()
        return [
            {
                "id": row[0],
                "item": row[1],
                "value": row[2],
                "upload_time": row[3]
            }
            for row in results
        ]

    def del_lexicon_id(self, lexicon_id):
        """根据UUID删除菜谱记录"""
        self.cursor.execute("""DELETE FROM lexicon WHERE id =?""", (lexicon_id,))
        self.conn.commit()
        return True

    def search_lexicon(self, keyword):
        """根据关键词模糊查询中文和英文"""
        self.cursor.execute(
            """
            SELECT id, item, value, upload_time FROM lexicon
            WHERE item LIKE ? OR value LIKE ?
            """,
            (f'%{keyword}%', f'%{keyword}%')
        )
        results = self.cursor.fetchall()
        return [
            {
                "id": row[0],
                "item": row[1],
                "value": row[2],
                "upload_time": row[3]
            }
            for row in results
        ]

    
    
