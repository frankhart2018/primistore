import os
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uuid

from utils.decrypt_utils import decode_memory
from utils.mongo_connection import MongoDB
from utils.charset_utils import decode_charset
from utils.command_utils import decrypt_aes
from utils.constants import PRIMISTORE_DIR

app = FastAPI()


def on_startup():
    os.makedirs(PRIMISTORE_DIR, exist_ok=True)


app.add_event_handler("startup", on_startup)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db_conn = MongoDB("passwords")


@app.get("/")
async def root():
    return {"status": "Hello World"}


@app.post("/password/decrypt/{pass_uid}")
# async def decrypt_password(pass_uid: str, body: DecryptBody):
async def decrypt_password(pass_uid: str, file: UploadFile):
    password = db_conn.find_one({"pass_uid": pass_uid})
    if password == None:
        return JSONResponse(content={"status": "UID not found!"}, status_code=500)

    image_path = PRIMISTORE_DIR / f"image-{uuid.uuid4()}.jpeg"
    with open(image_path, "wb") as f:
        f.write(await file.read())

    data_arr = decode_memory(str(image_path))
    charset_path = PRIMISTORE_DIR / f"charset-{pass_uid}.txt"
    charset_decrypted = decode_charset(data_arr, charset_path)
    decrypted = decrypt_aes(
        key=password["aes_key"],
        iv=password["aes_iv"],
        encrypted_string=charset_decrypted,
    )

    if decrypted is None:
        return JSONResponse(
            content={"status": "OpenSSL not installed!"}, status_code=500
        )

    return {"decrypted": decrypted}
