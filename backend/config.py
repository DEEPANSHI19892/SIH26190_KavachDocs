from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "kavachdocs-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 hours
    DATABASE_URL: str = "sqlite:///./kavachdocs.db"
    STORAGE_PATH: str = "./storage"

    class Config:
        env_file = ".env"

settings = Settings()
