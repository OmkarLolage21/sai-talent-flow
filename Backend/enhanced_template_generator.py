import cv2
import mediapipe as mp
import numpy as np
import json
import os
from datetime import datetime
from typing import List, Dict, Optional
import requests
from pathlib import Path

class EnhancedTemplateGenerator:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.mp_draw = mp.solutions.drawing_utils
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5,
            model_complexity=2
        )
        
        # Quality metrics
        self.quality_thresholds = {
            'min_visibility': 0.7,
            'stability_threshold': 0.05,  # Max allowed variation
            'min_frames': 30,  # Minimum frames for good template
            'max_frames': 300  # Maximum frames to prevent too much data
        }
        
        self.landmarks_buffer = []
        self.frame_count = 0

    def calculate_landmark_stability(self, landmarks_history: List[List]) -> float:
        """Calculate how stable the pose is across frames"""
        if len(landmarks_history) < 10:
            return 0.0
        
        stabilities = []
        for landmark_idx in range(33):  # MediaPipe has 33 landmarks
            positions = []
            for frame_landmarks in landmarks_history:
                if landmark_idx < len(frame_landmarks):
                    landmark = frame_landmarks[landmark_idx]
                    positions.append([landmark['x'], landmark['y'], landmark['z']])
            
            if len(positions) > 5:
                positions = np.array(positions)
                std_dev = np.std(positions, axis=0)
                stability = 1.0 - np.mean(std_dev)  # Higher stability = lower std dev
                stabilities.append(max(0, stability))
        
        return np.mean(stabilities) if stabilities else 0.0

    def filter_quality_frames(self, all_landmarks: List[List]) -> List[List]:
        """Filter frames based on pose quality and stability"""
        quality_frames = []
        
        for i, frame_landmarks in enumerate(all_landmarks):
            # Check visibility threshold
            visible_count = sum(1 for lm in frame_landmarks if lm['visibility'] >= self.quality_thresholds['min_visibility'])
            visibility_ratio = visible_count / len(frame_landmarks)
            
            if visibility_ratio >= 0.8:  # At least 80% landmarks should be visible
                quality_frames.append(frame_landmarks)
        
        return quality_frames

    def create_template_with_metadata(self, landmarks: List[Dict], exercise_name: str, 
                                    description: str = "") -> Dict:
        """Create template with additional metadata"""
        return {
            "name": exercise_name,
            "description": description,
            "created_at": datetime.now().isoformat(),
            "landmarks": landmarks,
            "metadata": {
                "total_frames_captured": self.frame_count,
                "quality_frames_used": len(landmarks),
                "average_visibility": np.mean([lm['visibility'] for lm in landmarks]),
                "generation_method": "enhanced_webcam_capture"
            }
        }

    def capture_template(self, exercise_name: str, description: str = "", 
                        capture_duration: int = 30) -> Optional[Dict]:
        """Capture exercise template with enhanced quality control"""
        print(f"🎥 Starting template capture for: {exercise_name}")
        print(f"⏱️  Capture duration: {capture_duration} seconds")
        print("📋 Instructions:")
        print("   1. Position yourself in good lighting")
        print("   2. Ensure your full body is visible")
        print("   3. Perform the exercise slowly and steadily")
        print("   4. Maintain good form throughout")
        print("   5. Press 'q' to stop early or ESC to cancel")
        
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("❌ Error: Could not access webcam")
            return None
        
        all_landmarks = []
        start_time = cv2.getTickCount()
        fps = cap.get(cv2.CAP_PROP_FPS) or 30
        total_frames_needed = int(capture_duration * fps)
        
        print("🟢 Recording started! Begin your exercise...")
        
        try:
            while cap.isOpened() and self.frame_count < total_frames_needed:
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Flip frame horizontally for mirror effect
                frame = cv2.flip(frame, 1)
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = self.pose.process(rgb_frame)
                
                # Display frame with pose landmarks
                display_frame = cv2.cvtColor(rgb_frame, cv2.COLOR_RGB2BGR)
                
                if results.pose_landmarks:
                    # Draw pose landmarks
                    self.mp_draw.draw_landmarks(
                        display_frame, results.pose_landmarks, 
                        self.mp_pose.POSE_CONNECTIONS
                    )
                    
                    # Extract landmarks
                    frame_landmarks = []
                    for landmark in results.pose_landmarks.landmark:
                        frame_landmarks.append({
                            "x": float(landmark.x),
                            "y": float(landmark.y),
                            "z": float(landmark.z),
                            "visibility": float(landmark.visibility)
                        })
                    
                    all_landmarks.append(frame_landmarks)
                    
                    # Quality indicator
                    visible_landmarks = sum(1 for lm in frame_landmarks if lm['visibility'] >= 0.7)
                    quality_color = (0, 255, 0) if visible_landmarks >= 25 else (0, 165, 255)
                    cv2.putText(display_frame, f"Quality: {visible_landmarks}/33", 
                              (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, quality_color, 2)
                
                # Progress indicator
                progress = (self.frame_count / total_frames_needed) * 100
                cv2.putText(display_frame, f"Progress: {progress:.1f}%", 
                          (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
                cv2.putText(display_frame, f"Frames: {len(all_landmarks)}", 
                          (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
                
                cv2.imshow('Template Capture - Press q to stop, ESC to cancel', display_frame)
                
                key = cv2.waitKey(1) & 0xFF
                if key == ord('q'):
                    print("🛑 Capture stopped by user")
                    break
                elif key == 27:  # ESC key
                    print("❌ Capture cancelled by user")
                    return None
                
                self.frame_count += 1
                
        finally:
            cap.release()
            cv2.destroyAllWindows()
        
        if len(all_landmarks) < self.quality_thresholds['min_frames']:
            print(f"⚠️  Warning: Only captured {len(all_landmarks)} frames (minimum {self.quality_thresholds['min_frames']})")
            return None
        
        print(f"✅ Captured {len(all_landmarks)} frames")
        
        # Filter quality frames
        quality_frames = self.filter_quality_frames(all_landmarks)
        print(f"📊 Quality frames after filtering: {len(quality_frames)}")
        
        if len(quality_frames) < self.quality_thresholds['min_frames']:
            print("❌ Not enough quality frames for reliable template")
            return None
        
        # Calculate stability
        stability = self.calculate_landmark_stability(quality_frames)
        print(f"📈 Pose stability score: {stability:.3f}")
        
        # Average the landmarks
        averaged_landmarks = []
        landmarks_array = np.array([[lm for lm in frame] for frame in quality_frames])
        
        for landmark_idx in range(33):
            landmark_data = landmarks_array[:, landmark_idx]
            
            # Calculate weighted average (higher visibility = higher weight)
            weights = np.array([lm['visibility'] for lm in landmark_data])
            weights = weights / np.sum(weights) if np.sum(weights) > 0 else np.ones_like(weights) / len(weights)
            
            avg_landmark = {
                "x": float(np.average([lm['x'] for lm in landmark_data], weights=weights)),
                "y": float(np.average([lm['y'] for lm in landmark_data], weights=weights)),
                "z": float(np.average([lm['z'] for lm in landmark_data], weights=weights)),
                "visibility": float(np.average([lm['visibility'] for lm in landmark_data], weights=weights))
            }
            averaged_landmarks.append(avg_landmark)
        
        # Create template with metadata
        template = self.create_template_with_metadata(
            averaged_landmarks, exercise_name, description
        )
        template['metadata']['stability_score'] = stability
        
        print("✅ Template generated successfully!")
        return template

    def save_template_locally(self, template: Dict, filename: str = None) -> str:
        """Save template to local file"""
        os.makedirs("templates", exist_ok=True)
        
        if filename is None:
            safe_name = "".join(c if c.isalnum() or c in (' ', '-', '_') else '' for c in template['name'])
            filename = f"template_{safe_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        filepath = f"templates/{filename}"
        
        with open(filepath, 'w') as f:
            json.dump(template, f, indent=2)
        
        print(f"💾 Template saved to: {filepath}")
        return filepath

    def upload_to_api(self, template: Dict, api_url: str = "http://localhost:8000") -> bool:
        """Upload template to FastAPI backend"""
        try:
            response = requests.post(
                f"{api_url}/templates/create",
                json=template,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"🚀 Template uploaded successfully! Template ID: {result.get('template_id')}")
                return True
            else:
                print(f"❌ Upload failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error uploading template: {str(e)}")
            return False

def main():
    generator = EnhancedTemplateGenerator()
    
    print("🏋️  Enhanced Exercise Template Generator")
    print("=" * 50)
    
    exercise_name = input("Enter exercise name: ").strip()
    if not exercise_name:
        print("❌ Exercise name is required")
        return
    
    description = input("Enter exercise description (optional): ").strip()
    
    duration = input("Capture duration in seconds (default 30): ").strip()
    try:
        duration = int(duration) if duration else 30
    except ValueError:
        duration = 30
    
    # Capture template
    template = generator.capture_template(exercise_name, description, duration)
    
    if template:
        # Save locally
        local_path = generator.save_template_locally(template)
        
        # Ask if user wants to upload to API
        upload_choice = input("\nUpload to API server? (y/n): ").strip().lower()
        if upload_choice == 'y':
            api_url = input("API URL (default: http://localhost:8000): ").strip()
            api_url = api_url if api_url else "http://localhost:8000"
            generator.upload_to_api(template, api_url)
        
        print("\n📋 Template Summary:")
        print(f"   Name: {template['name']}")
        print(f"   Description: {template.get('description', 'N/A')}")
        print(f"   Landmarks: {len(template['landmarks'])}")
        print(f"   Quality frames: {template['metadata']['quality_frames_used']}")
        print(f"   Stability score: {template['metadata'].get('stability_score', 'N/A'):.3f}")
        print(f"   Average visibility: {template['metadata']['average_visibility']:.3f}")
        
    else:
        print("❌ Template generation failed")

if __name__ == "__main__":
    main()