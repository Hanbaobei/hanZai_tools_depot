import sys
from pathlib import Path

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from router import tasks, words
from tortoise.contrib.fastapi import register_tortoise
from settings import TORTOISE_ORM
from fastapi.staticfiles import StaticFiles

# 获取当前文件的绝对路径
current_file_path = Path(__file__).resolve()
# 获取项目根目录（假设当前文件在项目根目录下）
project_root = current_file_path.parent
# 将项目根目录添加到 sys.path
sys.path.append(str(Path(__file__).resolve().parent))

app = FastAPI(
    title="FastAPI Demo",
    description="FastAPI Demo",
    version="0.0.1"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有源
    allow_credentials=True,  # 允许携带 Cookie
    allow_methods=["*"],  # 允许所有 HTTP 方法
    allow_headers=["*"]  # 允许所有请求头
)

# 挂载静态文件目录
app.mount("/static", StaticFiles(directory="static"), name="static")

# 注册 Tortoise ORM
register_tortoise(
    app,
    config=TORTOISE_ORM,
    generate_schemas=True,  # 自动创建表（生产环境建议关闭）
    add_exception_handlers=True,
)
app.include_router(tasks.router)
app.include_router(words.router)

if __name__ == '__main__':
    uvicorn.run(app="main:app", host="127.0.0.1", port=5000, reload=True)
