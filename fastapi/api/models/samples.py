from pydantic import BaseModel

class Sample(BaseModel):
    name:str
    description:str
    complete:bool

class AudioMetadata(BaseModel):
    description: str
    is_public: bool