from pydantic import BaseModel, Field


class WordQueryRequest(BaseModel):
    pageNumber: int = Field(default=1, ge=1)
    pageSize: int = Field(default=10, ge=1, le=100)
    keyword: str | None = None
