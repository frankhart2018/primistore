from pydantic import BaseModel


class DecryptBody(BaseModel):
    pms_path: str
