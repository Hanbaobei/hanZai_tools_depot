
class BaseResult:
    def __init__(self, data=None, code: int = 0, message: str = "ok", total: int = 0):
        super().__init__()
        self.code = code
        self.message = message
        self.data = data
        self.total = total


class Result:
    @staticmethod
    def success(data, total: int = 0) -> BaseResult:
        return BaseResult(data=data, total=total)

    @staticmethod
    def error(code: int, message: str, data) -> BaseResult:
        return BaseResult(code=code, message=message, data=data)
