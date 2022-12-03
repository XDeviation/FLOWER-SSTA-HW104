import os
import csv
from .model import SongList
from pypinyin import pinyin, Style
from fastapi import APIRouter

router = APIRouter()
SONG_LIST_FILE_PATH = './data/songlist.csv'


@router.get("/songlist", response_model=SongList)
async def get_song_list():
    res = []
    with open(SONG_LIST_FILE_PATH, mode='r', encoding='utf-8') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',')
        for row in spamreader:
            language, song_type, name, singer, comment = row
            try:
                first_letter = pinyin(name, style=Style.FIRST_LETTER)[0][0][0]
            except Exception as e:
                first_letter = 'z'
            res.append({
                "language": language,
                "type": song_type,
                "name": name,
                "singer": singer,
                "comment": comment,
                "first_letter": first_letter,
            })
    return {"data": res}