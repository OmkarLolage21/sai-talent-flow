import os
try:
    # pydantic v2.5+ moved BaseSettings to the separate pydantic-settings package
    from pydantic_settings import BaseSettings
except ModuleNotFoundError:
    # Provide a clearer error message depending on pydantic version
    try:
        import pydantic
        ver = getattr(pydantic, '__version__', '')
        # If pydantic >= 2.5, BaseSettings is no longer in pydantic
        if ver and tuple(int(x) for x in ver.split('.')[:2]) >= (2, 5):
            raise ImportError(
                "pydantic-settings is required for pydantic>=2.5.\n"
                "Install it in your virtualenv: `pip install pydantic-settings`\n"
                "Or add `pydantic-settings` to your requirements file and reinstall.`"
            )
    except Exception:
        # generic fallback message
        raise ImportError("Could not import BaseSettings. Install 'pydantic-settings' for newer pydantic versions or ensure 'pydantic' is installed.")
    # If we get here, try the older import as a last resort
    from pydantic import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # API Configuration
    app_name: str = "Exercise Analysis API"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    reload: bool = False
    
    # MediaPipe Configuration
    min_detection_confidence: float = 0.7
    min_tracking_confidence: float = 0.5
    model_complexity: int = 2
    
    # Analysis Configuration
    max_video_size_mb: int = 50
    max_analysis_duration: int = 300  # seconds
    default_capture_fps: int = 30
    
    # File Storage
    templates_dir: str = "templates"
    temp_dir: str = "temp"
    sessions_dir: str = "sessions"
    logs_dir: str = "logs"
    
    # CORS Configuration
    cors_origins: List[str] = ["*"]
    cors_allow_credentials: bool = True
    cors_allow_methods: List[str] = ["*"]
    cors_allow_headers: List[str] = ["*"]
    
    # Database Configuration (Optional)
    database_url: Optional[str] = None
    redis_url: Optional[str] = None
    
    # Security Configuration
    secret_key: str = "your-secret-key-change-in-production"
    access_token_expire_minutes: int = 30
    
    # Logging Configuration
    log_level: str = "INFO"
    log_format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Performance Configuration
    max_concurrent_analyses: int = 5
    enable_caching: bool = True
    cache_ttl_seconds: int = 3600
    
    # Quality Thresholds
    min_pose_visibility: float = 0.5
    min_template_frames: int = 30
    max_template_frames: int = 300
    stability_threshold: float = 0.05
    
    # Joint Analysis Thresholds
    joint_angle_tolerances: dict = {
        "elbow": {"min": 30, "max": 170, "tolerance": 15},
        "shoulder": {"min": 0, "max": 180, "tolerance": 20},
        "knee": {"min": 0, "max": 170, "tolerance": 15},
        "hip": {"min": 45, "max": 135, "tolerance": 20}
    }
    
    # Similarity Scoring Weights
    landmark_weights: dict = {
        "face": 0.3,      # Landmarks 0-10
        "upper_body": 1.5, # Landmarks 11-22
        "lower_body": 2.0  # Landmarks 23-32
    }
    
    # Real-time Analysis
    similarity_buffer_size: int = 150  # frames
    feedback_update_interval: float = 0.1  # seconds
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Global settings instance
settings = Settings()

# Environment-specific configurations
class DevelopmentSettings(Settings):
    debug: bool = True
    reload: bool = True
    log_level: str = "DEBUG"

class ProductionSettings(Settings):
    debug: bool = False
    reload: bool = False
    log_level: str = "WARNING"
    cors_origins: List[str] = ["https://yourdomain.com"]

class TestingSettings(Settings):
    debug: bool = True
    database_url: str = "sqlite:///./test.db"
    templates_dir: str = "test_templates"
    temp_dir: str = "test_temp"

def get_settings() -> Settings:
    """Get settings based on environment"""
    env = os.getenv("ENVIRONMENT", "development").lower()
    
    if env == "production":
        return ProductionSettings()
    elif env == "testing":
        return TestingSettings()
    else:
        return DevelopmentSettings()

# MediaPipe pose connections for visualization
POSE_CONNECTIONS = [
    # Face
    (0, 1), (1, 2), (2, 3), (3, 7), (0, 4), (4, 5), (5, 6), (6, 8),
    # Arms
    (9, 10), (11, 12), (11, 13), (13, 15), (15, 17), (15, 19), (15, 21),
    (16, 18), (18, 20), (16, 20), (16, 22), (12, 14), (14, 16),
    # Body
    (11, 23), (12, 24), (23, 24),
    # Legs
    (23, 25), (25, 27), (27, 29), (29, 31), (24, 26), (26, 28), (28, 30), (28, 32)
]

# Landmark names for reference
LANDMARK_NAMES = [
    "nose", "left_eye_inner", "left_eye", "left_eye_outer", "right_eye_inner",
    "right_eye", "right_eye_outer", "left_ear", "right_ear", "mouth_left",
    "mouth_right", "left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
    "left_wrist", "right_wrist", "left_pinky", "right_pinky", "left_index",
    "right_index", "left_thumb", "right_thumb", "left_hip", "right_hip",
    "left_knee", "right_knee", "left_ankle", "right_ankle", "left_heel",
    "right_heel", "left_foot_index", "right_foot_index"
]

# Color schemes for UI
UI_COLORS = {
    "excellent": (0, 255, 0),      # Green - 85%+
    "good": (0, 255, 255),         # Yellow - 70-84%
    "needs_work": (0, 165, 255),   # Orange - 50-69%
    "poor": (0, 0, 255),           # Red - <50%
    "text_primary": (255, 255, 255), # White
    "text_secondary": (200, 200, 200), # Light gray
    "background": (0, 0, 0),       # Black
    "panel_bg": (50, 50, 50),      # Dark gray
    "border": (255, 255, 255),     # White
    "pose_landmarks": (255, 0, 0),  # Blue
    "pose_connections": (0, 255, 0) # Green
}

# Exercise difficulty levels
DIFFICULTY_LEVELS = {
    "beginner": {
        "similarity_threshold": 60,
        "angle_tolerance_multiplier": 1.5,
        "feedback_sensitivity": "low"
    },
    "intermediate": {
        "similarity_threshold": 75,
        "angle_tolerance_multiplier": 1.0,
        "feedback_sensitivity": "medium"
    },
    "advanced": {
        "similarity_threshold": 85,
        "angle_tolerance_multiplier": 0.7,
        "feedback_sensitivity": "high"
    }
}