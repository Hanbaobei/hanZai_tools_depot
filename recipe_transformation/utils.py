import uuid
import pandas as pd
from recipe_transformation.dataBase import LexiconDataBase
import datetime


def clean_and_deduplicate_csv(input_file, output_file, columns=None):
    """
    清洗并去重CSV文件
    :param input_file: 输入CSV文件路径
    :param output_file: 输出CSV文件路径
    :param columns: 需要去重的列名列表，如果为None则整行去重
    :return: None
    """
    # 读取CSV文件
    df = pd.read_csv(input_file)

    # 去除前后空格
    df = df.map(lambda x: x.strip() if isinstance(x, str) else x)

    # 去重
    if columns:
        df = df.drop_duplicates(subset=columns)
    else:
        df = df.drop_duplicates()

    # 保存结果
    df.to_csv(output_file, index=False)

def csv_to_db(csv_file):
    """
    将CSV数据填充到SQLite数据库中
    :param csv_file: CSV文件路径
    """
    # 读取CSV文件
    df = pd.read_csv(csv_file)
    lexiconDataBase = LexiconDataBase()
    cursor = lexiconDataBase.cursor
    lexiconDataBase.conn.commit()

    # 插入数据
    placeholders = ', '.join(['?'] * 4)  # Fixed to 4 placeholders for id, item, value, and upload_time
    
    # 生成UUID并插入数据
    current_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    data_with_uuid = [
        [str(uuid.uuid4()), row[0], row[1] if pd.notna(row[1]) else '', current_time] 
        for row in df.values.tolist()
    ]
    
    sql = f'INSERT INTO lexicon VALUES ({placeholders})'
    cursor.executemany(sql, data_with_uuid)
    lexiconDataBase.conn.commit()
    # 关闭数据库连接
    lexiconDataBase.conn.close()
