from pydantic import BaseModel
from models.task import Task


class TaskCreateRequest(BaseModel):
    name = str


