from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from api_config import get_settings
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Tuple
import cv2
import mediapipe as mp
import numpy as np
import json
import os
import asyncio
import logging
from datetime import datetime
import uuid
from pathlib import Path
import base64

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="AI-powered exercise form analysis using MediaPipe",
    version=settings.app_version
)

# CORS middleware (driven by api_config settings)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)

# Initialize MediaPipe
mp_pose = mp.solutions.pose
mp_draw = mp.solutions.drawing_utils

class LandmarkData(BaseModel):
    x: float
    y: float
    z: float
    visibility: float

class ExerciseTemplate(BaseModel):
    name: str
    description: Optional[str] = None
    landmarks: List[LandmarkData]
    created_at: Optional[datetime] = None
    
class AnalysisResult(BaseModel):
    session_id: str
    overall_similarity: float
    frame_similarities: List[float]
    joint_errors: Dict[str, List[str]]
    recommendations: List[str]
    analysis_duration: float
    total_frames: int

class ExerciseAnalyzer:
    def __init__(self):
        self.pose = mp_pose.Pose(
            static_image_mode=False,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5,
            model_complexity=2
        )
        
        # MediaPipe landmark indices for key joints
        self.joint_connections = {
            'left_elbow': (11, 13, 15),    # shoulder, elbow, wrist
            'right_elbow': (12, 14, 16),
            'left_shoulder': (23, 11, 13), # hip, shoulder, elbow
            'right_shoulder': (24, 12, 14),
            'left_knee': (23, 25, 27),     # hip, knee, ankle
            'right_knee': (24, 26, 28),
            'left_hip': (11, 23, 25),      # shoulder, hip, knee
            'right_hip': (12, 24, 26),
        }
        
        # Angle thresholds for different joints
        self.angle_thresholds = {
            'elbow': {'min': 30, 'max': 170, 'tolerance': 15},
            'shoulder': {'min': 0, 'max': 180, 'tolerance': 20},
            'knee': {'min': 0, 'max': 170, 'tolerance': 15},
            'hip': {'min': 45, 'max': 135, 'tolerance': 20}
        }

    def calculate_angle(self, p1, p2, p3):
        """Calculate angle between three points"""
        try:
            # Convert to numpy arrays
            a = np.array([p1.x, p1.y])
            b = np.array([p2.x, p2.y])
            c = np.array([p3.x, p3.y])
            
            # Calculate vectors
            ba = a - b
            bc = c - b
            
            # Calculate cosine of angle
            cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
            cosine_angle = np.clip(cosine_angle, -1.0, 1.0)
            
            # Convert to degrees
            angle = np.arccos(cosine_angle)
            return np.degrees(angle)
        except:
            return 90.0  # Return neutral angle if calculation fails

    def calculate_3d_distance(self, p1: LandmarkData, p2: LandmarkData) -> float:
        """Calculate 3D Euclidean distance between two landmarks"""
        return np.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2 + (p1.z - p2.z)**2)

    def weighted_similarity(self, student_landmarks, template_landmarks) -> float:
        """Calculate weighted similarity score based on landmark importance"""
        if len(student_landmarks) != len(template_landmarks):
            return 0.0
        
        # Weight different body parts differently
        weights = {
            # Face landmarks (0-10) - lower weight
            **{i: 0.3 for i in range(11)},
            # Upper body landmarks (11-22) - high weight
            **{i: 1.5 for i in range(11, 23)},
            # Lower body landmarks (23-32) - highest weight for exercise
            **{i: 2.0 for i in range(23, 33)}
        }
        
        total_similarity = 0.0
        total_weight = 0.0
        
        for i, (student, template) in enumerate(zip(student_landmarks, template_landmarks)):
            if student.visibility < 0.5 or template.visibility < 0.5:
                continue
                
            weight = weights.get(i, 1.0)
            
            # Calculate 3D distance
            distance = self.calculate_3d_distance(student, template)
            
            # Convert distance to similarity (0-1 scale)
            similarity = max(0, 1 - distance)
            
            total_similarity += similarity * weight
            total_weight += weight
        
        return (total_similarity / total_weight * 100) if total_weight > 0 else 0.0

    def analyze_joint_angles(self, landmarks, template_landmarks) -> Dict[str, List[str]]:
        """Analyze joint angles and provide feedback"""
        errors = {
            'critical': [],
            'moderate': [],
            'minor': []
        }
        
        try:
            for joint_name, (p1_idx, p2_idx, p3_idx) in self.joint_connections.items():
                if (p1_idx < len(landmarks) and p2_idx < len(landmarks) and 
                    p3_idx < len(landmarks)):
                    
                    # Calculate current angle
                    current_angle = self.calculate_angle(
                        landmarks[p1_idx], landmarks[p2_idx], landmarks[p3_idx]
                    )
                    
                    # Calculate template angle
                    template_angle = self.calculate_angle(
                        template_landmarks[p1_idx], template_landmarks[p2_idx], 
                        template_landmarks[p3_idx]
                    )
                    
                    angle_diff = abs(current_angle - template_angle)
                    
                    # Determine joint type for threshold
                    joint_type = joint_name.split('_')[1] if '_' in joint_name else 'shoulder'
                    threshold = self.angle_thresholds.get(joint_type, self.angle_thresholds['shoulder'])
                    
                    if angle_diff > threshold['tolerance'] * 2:
                        errors['critical'].append(f"{joint_name}: {angle_diff:.1f}° deviation (critical)")
                    elif angle_diff > threshold['tolerance']:
                        errors['moderate'].append(f"{joint_name}: {angle_diff:.1f}° deviation (moderate)")
                    elif angle_diff > threshold['tolerance'] * 0.5:
                        errors['minor'].append(f"{joint_name}: {angle_diff:.1f}° deviation (minor)")
                        
        except Exception as e:
            logger.error(f"Error analyzing joint angles: {e}")
            
        return errors

    def generate_recommendations(self, similarity: float, joint_errors: Dict[str, List[str]]) -> List[str]:
        """Generate personalized recommendations based on analysis"""
        recommendations = []
        
        if similarity < 60:
            recommendations.append("🚨 Overall form needs significant improvement. Consider slowing down and focusing on proper technique.")
        elif similarity < 80:
            recommendations.append("⚠️ Good effort! Focus on the specific joint corrections mentioned below.")
        else:
            recommendations.append("✅ Excellent form! Keep up the great work.")
        
        # Add specific recommendations based on errors
        if joint_errors['critical']:
            recommendations.append("🔴 Critical issues detected - these could lead to injury if not corrected.")
        
        if 'elbow' in str(joint_errors):
            recommendations.append("💪 Focus on elbow positioning - keep them aligned with your shoulders.")
            
        if 'knee' in str(joint_errors):
            recommendations.append("🦵 Pay attention to knee alignment - avoid inward collapse.")
            
        if 'shoulder' in str(joint_errors):
            recommendations.append("🏋️ Maintain proper shoulder posture throughout the movement.")
        
        return recommendations

# Global analyzer instance
analyzer = ExerciseAnalyzer()

# In-memory storage (replace with database in production)
exercise_templates: Dict[str, ExerciseTemplate] = {}
analysis_sessions: Dict[str, AnalysisResult] = {}

@app.get("/")
async def root():
    return {"message": "Exercise Analysis API is running!", "version": "1.0.0"}

@app.post("/templates/create")
async def create_template(template: ExerciseTemplate):
    """Create a new exercise template"""
    try:
        template_id = str(uuid.uuid4())
        template.created_at = datetime.now()
        exercise_templates[template_id] = template
        
        # Save to file
        os.makedirs("templates", exist_ok=True)
        with open(f"templates/{template_id}.json", "w") as f:
            json.dump(template.dict(), f, indent=2, default=str)
        
        return {
            "message": "Template created successfully",
            "template_id": template_id,
            "template": template
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating template: {str(e)}")

@app.get("/templates")
async def list_templates():
    """List all exercise templates"""
    return {"templates": exercise_templates}

@app.get("/templates/{template_id}")
async def get_template(template_id: str):
    """Get a specific exercise template"""
    if template_id not in exercise_templates:
        raise HTTPException(status_code=404, detail="Template not found")
    return exercise_templates[template_id]

@app.post("/analyze/webcam/{template_id}")
async def start_webcam_analysis(template_id: str, duration_seconds: int = 30):
    """Start webcam analysis session"""
    if template_id not in exercise_templates:
        raise HTTPException(status_code=404, detail="Template not found")
    
    session_id = str(uuid.uuid4())
    
    try:
        template = exercise_templates[template_id]
        template_landmarks = [LandmarkData(**landmark.dict()) for landmark in template.landmarks]
        
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            raise HTTPException(status_code=500, detail="Could not access webcam")
        
        similarities = []
        all_joint_errors = {'critical': [], 'moderate': [], 'minor': []}
        frame_count = 0
        start_time = datetime.now()
        
        while cap.isOpened() and frame_count < duration_seconds * 30:  # Assuming 30 FPS
            success, frame = cap.read()
            if not success:
                break
            
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = analyzer.pose.process(rgb_frame)
            
            if results.pose_landmarks:
                landmarks = results.pose_landmarks.landmark
                
                # Convert to LandmarkData objects
                student_landmarks = [
                    LandmarkData(x=lm.x, y=lm.y, z=lm.z, visibility=lm.visibility)
                    for lm in landmarks
                ]
                
                # Calculate similarity
                similarity = analyzer.weighted_similarity(student_landmarks, template_landmarks)
                similarities.append(similarity)
                
                # Analyze joint errors
                joint_errors = analyzer.analyze_joint_angles(student_landmarks, template_landmarks)
                
                # Accumulate errors
                for error_type in all_joint_errors:
                    all_joint_errors[error_type].extend(joint_errors[error_type])
            
            frame_count += 1
        
        cap.release()
        
        # Calculate results
        overall_similarity = np.mean(similarities) if similarities else 0.0
        analysis_duration = (datetime.now() - start_time).total_seconds()
        
        # Generate recommendations
        recommendations = analyzer.generate_recommendations(overall_similarity, all_joint_errors)
        
        # Create analysis result
        result = AnalysisResult(
            session_id=session_id,
            overall_similarity=overall_similarity,
            frame_similarities=similarities,
            joint_errors=all_joint_errors,
            recommendations=recommendations,
            analysis_duration=analysis_duration,
            total_frames=frame_count
        )
        
        analysis_sessions[session_id] = result
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/analyze/video/{template_id}")
async def analyze_video(template_id: str, video: UploadFile = File(...)):
    """Analyze uploaded video file"""
    if template_id not in exercise_templates:
        raise HTTPException(status_code=404, detail="Template not found")
    
    session_id = str(uuid.uuid4())
    
    try:
        # Save uploaded video
        video_path = f"temp_{session_id}.mp4"
        with open(video_path, "wb") as f:
            content = await video.read()
            f.write(content)
        
        template = exercise_templates[template_id]
        template_landmarks = [LandmarkData(**landmark.dict()) for landmark in template.landmarks]
        
        cap = cv2.VideoCapture(video_path)
        similarities = []
        all_joint_errors = {'critical': [], 'moderate': [], 'minor': []}
        frame_count = 0
        start_time = datetime.now()
        
        while cap.isOpened():
            success, frame = cap.read()
            if not success:
                break
            
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = analyzer.pose.process(rgb_frame)
            
            if results.pose_landmarks:
                landmarks = results.pose_landmarks.landmark
                
                student_landmarks = [
                    LandmarkData(x=lm.x, y=lm.y, z=lm.z, visibility=lm.visibility)
                    for lm in landmarks
                ]
                
                similarity = analyzer.weighted_similarity(student_landmarks, template_landmarks)
                similarities.append(similarity)
                
                joint_errors = analyzer.analyze_joint_angles(student_landmarks, template_landmarks)
                
                for error_type in all_joint_errors:
                    all_joint_errors[error_type].extend(joint_errors[error_type])
            
            frame_count += 1
        
        cap.release()
        os.remove(video_path)  # Clean up
        
        overall_similarity = np.mean(similarities) if similarities else 0.0
        analysis_duration = (datetime.now() - start_time).total_seconds()
        recommendations = analyzer.generate_recommendations(overall_similarity, all_joint_errors)
        
        result = AnalysisResult(
            session_id=session_id,
            overall_similarity=overall_similarity,
            frame_similarities=similarities,
            joint_errors=all_joint_errors,
            recommendations=recommendations,
            analysis_duration=analysis_duration,
            total_frames=frame_count
        )
        
        analysis_sessions[session_id] = result
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video analysis failed: {str(e)}")

@app.get("/analysis/{session_id}")
async def get_analysis_result(session_id: str):
    """Get analysis result by session ID"""
    if session_id not in analysis_sessions:
        raise HTTPException(status_code=404, detail="Analysis session not found")
    return analysis_sessions[session_id]

@app.get("/analysis")
async def list_analysis_sessions():
    """List all analysis sessions"""
    return {"sessions": list(analysis_sessions.keys())}

@app.delete("/analysis/{session_id}")
async def delete_analysis_session(session_id: str):
    """Delete an analysis session"""
    if session_id not in analysis_sessions:
        raise HTTPException(status_code=404, detail="Analysis session not found")
    
    del analysis_sessions[session_id]
    return {"message": "Analysis session deleted successfully"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "templates_count": len(exercise_templates),
        "active_sessions": len(analysis_sessions)
    }

if __name__ == "__main__":
    import uvicorn
    # Use settings for host/port and reload behavior
    uvicorn.run(
        "exercise_analysis_backend:app",
        host=settings.host,
        port=settings.port,
        reload=settings.reload,
        log_level=settings.log_level.lower()
    )