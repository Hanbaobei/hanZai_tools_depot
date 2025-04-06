from tortoise.models import Model
from tortoise import fields


class Task(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255)
    status = fields.IntField(max_length=1)
    content = fields.TextField()
    create_time = fields.DatetimeField(auto_now_add=True)
    update_time = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "task"
