import base64
import io
import os
import shutil
import sys
from pipes import quote

from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path

from starlette.responses import StreamingResponse, FileResponse

from common.Result import Result
from models.task import Task
from utils.translate import extract_menu_data, generate_html, translate_data, generate_docx

router = APIRouter(
    prefix="/task",  # 路由前缀
    tags=["task"],  # API 标签（用于网页分类）
)

# 获取当前文件的绝对路径
current_file_path = Path(__file__).resolve()
# 获取项目根目录（假设当前文件在项目根目录下）
project_root = current_file_path.parent


@router.get("/get/{id}")
async def get_task_by_Id(id: int):
    task_exists = await Task.filter(id=id).exists()
    if not task_exists:
        return Result.error(code=-1, message="任务不存在!", data=None)
    task = await Task.get(id=id)
    return Result.success(data=task)


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    ALLOWED_TYPES = ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    # 验证文件类型
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="仅支持 .docx 文件")
    # 安全保存文件
    filename = Path(file.filename).stem  # 去除扩展名和特殊字符  # 去除特殊字符
    save_path = Path(sys.path[0] + "/uploads" + os.sep + filename)

    try:
        with open(save_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        # 处理文件内容（示例逻辑）
        data = extract_menu_data(save_path)
        translated_data = await translate_data(data)
        html = generate_html(translated_data)
        task = await Task.create(name=file.filename, status=1, content=html)
        return Result.success(data=task)
    finally:
        # 删除临时文件
        if save_path.exists():
            save_path.unlink()


@router.get("/download/{id}")
async def download_file(id: int):
    task_exists = await Task.filter(id=id).exists()
    if not task_exists:
        return Result.error(code=-1, message="任务不存在!", data=None)
    task = await Task.filter(id=id).first().values("id", "content", "name")
    html = task["content"]
    name = task["name"]
    doc = await generate_docx(html=html)
    print(doc.tables)
    file_stream = io.BytesIO()
    doc.save(file_stream)
    file_stream.seek(0)
    encoded_name = base64.b64encode(name.encode("utf-8")).decode("utf-8")
    headers = {
        "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_name}.docx",
        "Content-Type": "application/msword"
    }
    return StreamingResponse(file_stream,
                             headers=headers,
                             media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")


@router.get("/list")
async def get_tasks():
    tasks = await Task.all()
    return Result.success(data=tasks)
