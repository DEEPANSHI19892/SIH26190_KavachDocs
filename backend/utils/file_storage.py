import os
from config import settings

def ensure_storage_path():
    os.makedirs(settings.STORAGE_PATH, exist_ok=True)

def get_storage_path():
    return settings.STORAGE_PATH