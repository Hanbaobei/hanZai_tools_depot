import pandas as pd


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