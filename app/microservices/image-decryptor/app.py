import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from models.decrypt_body import DecryptBody
from utils.decrypt_utils import decode_memory
from utils.mongo_connection import MongoDB
from utils.charset_utils import decode_charset
from utils.command_utils import decrypt_aes
from utils.constants import PRIMISTORE_DIR

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db_conn = MongoDB("passwords")


@app.get("/")
async def root():
    return {"status": "Hello World"}


@app.post("/password/decrypt/{pass_uid}")
async def decrypt_password(pass_uid: str, body: DecryptBody):
    img_path = body.pms_path
    if not os.path.exists(img_path):
        return JSONResponse(
            content={"status": "PMS path specified does not exist!"}, status_code=500
        )

    password = db_conn.find_one({"pass_uid": pass_uid})
    if password == None:
        return JSONResponse(content={"status": "UID not found!"}, status_code=500)

    data_arr = decode_memory(body.pms_path)
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
