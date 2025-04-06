from fastapi import APIRouter, Depends

from common.Result import Result
from models.words import Words
from schema.word_schema import WordQueryRequest
from tortoise.expressions import Q

router = APIRouter(
    prefix="/words",  # 路由前缀
    tags=["words"],  # API 标签（用于网页分类）
)


@router.get("/get/{id}", name="根据Id获取词组")
async def get_word_by_Id(id: int):
    task_exists = await Words.filter(id=id).exists()
    if not task_exists:
        return Result.error(-1, "单词不存在!")
    task = await Words.get(id=id)
    return task


@router.post("/list")
async def get_words(wordQueryRequest: WordQueryRequest):
    pageNumber = wordQueryRequest.pageNumber
    pageSize = wordQueryRequest.pageSize
    keyword = wordQueryRequest.keyword
    offset = (pageNumber - 1) * pageSize
    # 构建基础查询
    query = Words.all()
    # 添加关键词搜索条件（模糊匹配 word 或 translation）
    if keyword:
        query = query.filter(
            Q(word__icontains=keyword) | Q(translation__icontains=keyword))
        # 分页处理
    words = await query.order_by('-create_time').offset(offset).limit(pageSize).all()
    # 计算总数（可选）
    total = await Words.filter(
        Q(word__icontains=keyword) | Q(translation__icontains=keyword)
    ).count() if keyword else await Words.all().count()
    return Result.success(data={
        "list": words,
        "pageNumber": pageNumber,
        "pageSize": pageSize,
        "total": total
    })
