import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from models.decrypt_body import DecryptBody
from utils.decrypt_utils import decode_memory

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"status": "Hello World"}


@app.post("/password/decrypt")
async def decrypt_password(body: DecryptBody):
    img_path = body.pms_path
    if not os.path.exists(img_path):
        return JSONResponse(
            content={"status": "PMS path specified does not exist!"}, status_code=500
        )

    data_arr = decode_memory(body.pms_path)
    return {"data_arr": data_arr.tolist()}
