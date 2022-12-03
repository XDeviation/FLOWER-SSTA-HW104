from typing import List, Union

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class SongInfo(BaseModel):
    language: Union[str, None]
    type: Union[str, None]
    name: Union[str, None]
    singer: Union[str, None]
    comment: Union[str, None]
    first_letter: Union[str, None]

class SongList(BaseModel):
    data: List[SongInfo]

