from tortoise.models import Model
from tortoise import fields


class Words(Model):
    id = fields.IntField(pk=True)
    word = fields.CharField(max_length=255)
    translation = fields.CharField(max_length=255)
    create_time = fields.DatetimeField(auto_now_add=True)
    update_time = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "words"
