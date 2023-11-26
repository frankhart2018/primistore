import os
from pathlib import Path


CONN_STRING = os.environ.get("DB_CONNECTION_STRING", "mongodb://localhost:27017")
DB_NAME = "primistore"

HOME_DIR = Path.home()
PRIMISTORE_DIR = HOME_DIR / ".primistore"
