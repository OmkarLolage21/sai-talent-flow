import cv2
import mediapipe as mp
import numpy as np
import requests
import json
import time
from typing import Dict, List, Optional
from datetime import datetime
import threading
import queue

class RealTimeExerciseAnalyzer:
    def __init__(self, api_url: str = "http://localhost:8000"):
        self.api_url = api_url
        self.mp_pose = mp.solutions.pose
        self.mp_draw = mp.solutions.drawing_utils
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5,
            model_complexity=1  # Lower complexity for real-time
        )
        
        # Analysis buffers
        self.landmarks_buffer = []
        self.similarity_buffer = []
        self.max_buffer_size = 150  # 5 seconds at 30fps
        
        # UI colors
        self.colors = {
            'excellent': (0, 255, 0),    # Green
            'good': (0, 255, 255),       # Yellow
            'needs_work': (0, 165, 255), # Orange
            'poor': (0, 0, 255),         # Red
            'text': (255, 255, 255),     # White
            'bg': (0, 0, 0)              # Black
        }
        
        self.template_cache = {}
        self.current_analysis = None

    def get_templates(self) -> Dict:
        """Fetch available templates from API"""
        try:
            response = requests.get(f"{self.api_url}/templates")
            if response.status_code == 200:
                return response.json()['templates']
            return {}
        except Exception as e:
            print(f"Error fetching templates: {e}")
            return {}

    def get_similarity_color(self, similarity: float) -> tuple:
        """Get color based on similarity score"""
        if similarity >= 85:
            return self.colors['excellent']
        elif similarity >= 70:
            return self.colors['good']
        elif similarity >= 50:
            return self.colors['needs_work']
        else:
            return self.colors['poor']

    def draw_similarity_bar(self, frame: np.ndarray, similarity: float, x: int, y: int):
        """Draw a horizontal similarity bar"""
        bar_width = 200
        bar_height = 20
        
        # Background bar
        cv2.rectangle(frame, (x, y), (x + bar_width, y + bar_height), (50, 50, 50), -1)
        
        # Fill bar based on similarity
        fill_width = int((similarity / 100) * bar_width)
        color = self.get_similarity_color(similarity)
        cv2.rectangle(frame, (x, y), (x + fill_width, y + bar_height), color, -1)
        
        # Border
        cv2.rectangle(frame, (x, y), (x + bar_width, y + bar_height), (255, 255, 255), 1)
        
        # Text
        cv2.putText(frame, f"{similarity:.1f}%", (x + 5, y + 15), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

    def calculate_joint_angles(self, landmarks) -> Dict[str, float]:
        """Calculate key joint angles"""
        angles = {}
        
        try:
            # Helper function to calculate angle between three points
            def get_angle(p1, p2, p3):
                a = np.array([p1.x, p1.y])
                b = np.array([p2.x, p2.y])
                c = np.array([p3.x, p3.y])
                
                radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
                angle = np.abs(radians * 180.0 / np.pi)
                
                if angle > 180.0:
                    angle = 360 - angle
                return angle
            
            # Calculate key angles
            angles['left_elbow'] = get_angle(landmarks[11], landmarks[13], landmarks[15])
            angles['right_elbow'] = get_angle(landmarks[12], landmarks[14], landmarks[16])
            angles['left_shoulder'] = get_angle(landmarks[23], landmarks[11], landmarks[13])
            angles['right_shoulder'] = get_angle(landmarks[24], landmarks[12], landmarks[14])
            angles['left_knee'] = get_angle(landmarks[23], landmarks[25], landmarks[27])
            angles['right_knee'] = get_angle(landmarks[24], landmarks[26], landmarks[28])
            
        except Exception as e:
            print(f"Error calculating angles: {e}")
            
        return angles

    def calculate_similarity(self, student_landmarks, template_landmarks) -> float:
        """Calculate similarity between current pose and template"""
        if len(student_landmarks) != len(template_landmarks):
            return 0.0
        
        total_similarity = 0.0
        valid_landmarks = 0
        
        # Weight different body parts
        weights = {
            # Face/head landmarks (0-10) - lower weight
            **{i: 0.5 for i in range(11)},
            # Upper body (11-22) - high weight
            **{i: 1.5 for i in range(11, 23)},
            # Lower body (23-32) - highest weight
            **{i: 2.0 for i in range(23, 33)}
        }
        
        for i, (student, template) in enumerate(zip(student_landmarks, template_landmarks)):
            if student.visibility < 0.5:
                continue
                
            # Calculate 3D distance
            dx = student.x - template['x']
            dy = student.y - template['y'] 
            dz = student.z - template['z']
            distance = np.sqrt(dx*dx + dy*dy + dz*dz)
            
            # Convert distance to similarity
            similarity = max(0, 1 - distance)
            weight = weights.get(i, 1.0)
            
            total_similarity += similarity * weight
            valid_landmarks += weight
            
        return (total_similarity / valid_landmarks * 100) if valid_landmarks > 0 else 0.0

    def draw_feedback_panel(self, frame: np.ndarray, similarity: float, angles: Dict[str, float]):
        """Draw feedback panel with pose information"""
        panel_height = 300
        panel_width = 300
        x_offset = frame.shape[1] - panel_width - 10
        y_offset = 10
        
        # Semi-transparent background
        overlay = frame.copy()
        cv2.rectangle(overlay, (x_offset, y_offset), 
                     (x_offset + panel_width, y_offset + panel_height), (0, 0, 0), -1)
        cv2.addWeighted(overlay, 0.7, frame, 0.3, 0, frame)
        
        # Border
        cv2.rectangle(frame, (x_offset, y_offset), 
                     (x_offset + panel_width, y_offset + panel_height), (255, 255, 255), 2)
        
        # Title
        cv2.putText(frame, "Exercise Analysis", (x_offset + 10, y_offset + 25), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        
        # Similarity score
        cv2.putText(frame, "Overall Score:", (x_offset + 10, y_offset + 55), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        self.draw_similarity_bar(frame, similarity, x_offset + 10, y_offset + 65)
        
        # Angle information
        y_pos = y_offset + 100
        cv2.putText(frame, "Joint Angles:", (x_offset + 10, y_pos), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        y_pos += 25
        
        for joint_name, angle in angles.items():
            display_name = joint_name.replace('_', ' ').title()
            cv2.putText(frame, f"{display_name}: {angle:.1f}°", 
                       (x_offset + 10, y_pos), cv2.FONT_HERSHEY_SIMPLEX, 0.4, 
                       (200, 200, 200), 1)
            y_pos += 20
        
        # Average similarity (if available)
        if len(self.similarity_buffer) > 5:
            avg_similarity = np.mean(self.similarity_buffer[-30:])  # Last 30 frames
            cv2.putText(frame, f"30-Frame Avg: {avg_similarity:.1f}%", 
                       (x_offset + 10, y_offset + panel_height - 15), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1)

    def analyze_real_time(self, template_id: str):
        """Perform real-time analysis against a template"""
        # Get template from API
        try:
            response = requests.get(f"{self.api_url}/templates/{template_id}")
            if response.status_code != 200:
                print(f"Error: Template {template_id} not found")
                return
            template = response.json()
        except Exception as e:
            print(f"Error fetching template: {e}")
            return
        
        print(f"🏋️  Starting real-time analysis for: {template['name']}")
        print("📋 Instructions:")
        print("   - Position yourself similar to the template pose")
        print("   - Green = Excellent (85%+), Yellow = Good (70%+)")
        print("   - Orange = Needs Work (50%+), Red = Poor (<50%)")
        print("   - Press 'q' to quit, 's' to save session")
        
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("❌ Error: Could not access webcam")
            return
        
        # Set camera properties for better performance
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
        cap.set(cv2.CAP_PROP_FPS, 30)
        
        frame_count = 0
        start_time = time.time()
        
        try:
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                
                frame = cv2.flip(frame, 1)  # Mirror effect
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = self.pose.process(rgb_frame)
                
                if results.pose_landmarks:
                    # Draw pose landmarks
                    self.mp_draw.draw_landmarks(
                        frame, results.pose_landmarks, self.mp_pose.POSE_CONNECTIONS
                    )
                    
                    # Calculate similarity
                    landmarks = results.pose_landmarks.landmark
                    similarity = self.calculate_similarity(landmarks, template['landmarks'])
                    
                    # Calculate joint angles
                    angles = self.calculate_joint_angles(landmarks)
                    
                    # Update buffers
                    self.similarity_buffer.append(similarity)
                    if len(self.similarity_buffer) > self.max_buffer_size:
                        self.similarity_buffer.pop(0)
                    
                    # Draw feedback panel
                    self.draw_feedback_panel(frame, similarity, angles)
                    
                    # Main similarity display
                    color = self.get_similarity_color(similarity)
                    cv2.putText(frame, f"Similarity: {similarity:.1f}%", 
                               (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.2, color, 3)
                    
                    # Exercise name
                    cv2.putText(frame, f"Exercise: {template['name']}", 
                               (20, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
                
                else:
                    cv2.putText(frame, "No pose detected!", (20, 50), 
                               cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                
                # Performance info
                current_time = time.time()
                elapsed_time = current_time - start_time
                fps = frame_count / elapsed_time if elapsed_time > 0 else 0
                cv2.putText(frame, f"FPS: {fps:.1f} | Time: {elapsed_time:.1f}s", 
                           (20, frame.shape[0] - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, 
                           (255, 255, 255), 1)
                
                cv2.imshow(f'Real-time Analysis - {template["name"]}', frame)
                
                key = cv2.waitKey(1) & 0xFF
                if key == ord('q'):
                    break
                elif key == ord('s'):
                    self.save_analysis_session(template_id)
                
                frame_count += 1
                
        finally:
            cap.release()
            cv2.destroyAllWindows()
            
            # Print session summary
            if len(self.similarity_buffer) > 0:
                avg_similarity = np.mean(self.similarity_buffer)
                max_similarity = np.max(self.similarity_buffer)
                min_similarity = np.min(self.similarity_buffer)
                
                print(f"\n📊 Session Summary:")
                print(f"   Duration: {elapsed_time:.1f} seconds")
                print(f"   Frames analyzed: {len(self.similarity_buffer)}")
                print(f"   Average similarity: {avg_similarity:.1f}%")
                print(f"   Best similarity: {max_similarity:.1f}%")
                print(f"   Lowest similarity: {min_similarity:.1f}%")

    def save_analysis_session(self, template_id: str):
        """Save current analysis session"""
        if not self.similarity_buffer:
            print("❌ No data to save")
            return
        
        session_data = {
            "template_id": template_id,
            "timestamp": datetime.now().isoformat(),
            "frame_similarities": self.similarity_buffer.copy(),
            "average_similarity": np.mean(self.similarity_buffer),
            "max_similarity": np.max(self.similarity_buffer),
            "min_similarity": np.min(self.similarity_buffer),
            "total_frames": len(self.similarity_buffer)
        }
        
        filename = f"session_{template_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        os.makedirs("sessions", exist_ok=True)
        
        with open(f"sessions/{filename}", 'w') as f:
            json.dump(session_data, f, indent=2)
        
        print(f"💾 Session saved to: sessions/{filename}")

def main():
    print("🏋️  Enhanced Exercise Analysis Client")
    print("=" * 50)
    
    api_url = input("API URL (default: http://localhost:8000): ").strip()
    api_url = api_url if api_url else "http://localhost:8000"
    
    analyzer = RealTimeExerciseAnalyzer(api_url)
    
    # Test API connection
    try:
        response = requests.get(f"{api_url}/health")
        if response.status_code != 200:
            print("❌ Cannot connect to API server")
            return
        print("✅ Connected to API server")
    except Exception as e:
        print(f"❌ Cannot connect to API server: {e}")
        return
    
    # Get available templates
    templates = analyzer.get_templates()
    if not templates:
        print("❌ No templates available. Please create a template first.")
        return
    
    # Display available templates
    print("\n📋 Available Templates:")
    template_list = list(templates.items())
    for i, (template_id, template) in enumerate(template_list):
        print(f"   {i+1}. {template['name']} - {template.get('description', 'No description')}")
    
    # Template selection
    try:
        choice = int(input(f"\nSelect template (1-{len(template_list)}): ")) - 1
        if 0 <= choice < len(template_list):
            template_id = template_list[choice][0]
            analyzer.analyze_real_time(template_id)
        else:
            print("❌ Invalid selection")
    except ValueError:
        print("❌ Invalid input")

if __name__ == "__main__":
    import os
    main()