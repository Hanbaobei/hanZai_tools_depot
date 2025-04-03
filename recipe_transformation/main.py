import io
import os
import logging
from flask import Flask, request, render_template, redirect
from werkzeug.utils import secure_filename
from flask import send_file, g
from flask_cors import CORS

from recipe_transformation.dataBase import TranslateDataBase, LexiconDataBase
from recipe_transformation.translate import (
    extract_menu_data,
    load_translation_from_csv,
    translate_data,
    generate_html,
    generate_docx,
)

app = Flask(__name__, static_folder="static", static_url_path="/")
CORS(app)  # 添加CORS支持
app.config["UPLOAD_FOLDER"] = "uploads"
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB
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


# 数据库
def get_translateDataBase():
    """Get a thread-local database connection"""
    if "translateDataBase" not in g:
        g.translateDataBase = TranslateDataBase()
    return g.translateDataBase


def get_lexiconDataBase():
    """Get a thread-local database connection"""
    if "lexiconDataBase" not in g:
        g.lexiconDataBase = LexiconDataBase()
    return g.lexiconDataBase

@app.route("/")
def index():
    return redirect('/index.html')


@app.route("/upload", methods=["GET", "POST"])
def upload_file():
    global html
    if request.method == "POST":
        # 检查是否有文件上传
        if "file" not in request.files:
            return "没有选择文件"

        file = request.files["file"]
        if file.filename == "":
            return "没有选择文件"

        if file:
            if file.filename and file.filename.endswith(".docx"):
                # 保存文件
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
                file.save(file_path)
                try:
                    # 解析和翻译文件
                    data = extract_menu_data(file_path)
                    translation = load_translation_from_csv(
                        os.path.join(current_folder_path, "translation.csv")
                    )
                    translated_data = translate_data(data, translation)
                    html = generate_html(translated_data)
                    translateDataBase = get_translateDataBase()
                    id = translateDataBase.insert_translate(html, file.filename)

                    return {"id": id, "html": html, "filename": filename}
                finally:
                    # 删除上传的文件
                    if os.path.exists(file_path):
                        os.remove(file_path)
            else:
                return "请上传 .docx 文件"


@app.route("/download", methods=["GET"])
def download_file():
    # 获取请求中的UUID参数
    uuid = request.args.get("uuid")
    if not uuid:
        return "缺少UUID参数", 400

    # 从数据库获取对应的HTML内容
    translateDataBase = get_translateDataBase()
    [id, html, file_name, upload_time] = translateDataBase.get_translate_by_id(uuid)
    if not html:
        return "未找到对应的食谱", 404

    # 生成Word文档
    output_filename = "尚城幼儿园幼儿食谱.docx"
    doc = generate_docx(html)

    # 将文档保存到内存中
    file_stream = io.BytesIO()
    doc.save(file_stream)
    file_stream.seek(0)
    return send_file(
        file_stream,
        as_attachment=True,
        download_name=output_filename,
        mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )


@app.route("/list", methods=["GET"])
def list_translate():
    translateDataBase = get_translateDataBase()
    translates = translateDataBase.get_all_translate()
    return {"data": translates}


@app.route("/get/<id>", methods=["GET"])
def get_translate_id(id):
    """根据ID获取单个翻译记录"""
    translateDataBase = get_translateDataBase()
    result = translateDataBase.get_translate_by_id(id)
    if result:
        return {
            "id": result[0],
            "html": result[1],
            "file_name": result[2],
            "upload_time": result[3],
        }
    return {"error": "未找到对应的记录"}, 404


@app.route("/lexicon/list", methods=["GET"])
def list_lexicon():
    lexiconDataBase = get_lexiconDataBase()
    lexicons = lexiconDataBase.get_lexicon_all()
    return {"data": lexicons}


@app.route("/lexicon/add", methods=["POST"])
def add_lexicon():
    lexiconDataBase = get_lexiconDataBase()
    data = request.json
    id = lexiconDataBase.insert_lexicon(data["item"], data["value"])
    return {"id": id}


@app.route("/lexicon/delete/<id>", methods=["DELETE"])
def delete_lexicon(id):
    lexiconDataBase = get_lexiconDataBase()
    lexiconDataBase.delete_lexicon(id)
    return {"message": "删除成功"}


@app.route("/lexicon/update/<id>", methods=["PUT"])
def update_lexicon(id):
    lexiconDataBase = get_lexiconDataBase()
    data = request.json
    lexiconDataBase.update_lexicon(id, data["item"], data["value"])
    return {"message": "更新成功"}


@app.route("/lexicon/search", methods=["GET"])
def search_lexicon():
    lexiconDataBase = get_lexiconDataBase()
    keyword = request.args.get("keyword")
    if not keyword:
        return {"error": "缺少关键字参数"}, 400
    results = lexiconDataBase.search_lexicon(keyword)
    return {"data": results}


@app.teardown_appcontext
def close_db(exception):
    db = g.pop("db", None)
    if db is not None:
        db.close()


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
