from fastapi import FastAPI, Response, UploadFile, File, Form, HTTPException, Request, WebSocket
from fastapi.responses import HTMLResponse, StreamingResponse
import uvicorn
import cv2
import numpy as np
import insightface
from insightface.app import FaceAnalysis
from scipy.spatial.distance import cosine
import time
import csv
import os
from starlette.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import asyncio  # Import asyncio for handling async errors

app = FastAPI()

src = "5.mov"

# Enable CORS to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to restrict access to specific domains
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

app.mount("/static", StaticFiles(directory="static"), name="static")

# Load ArcFace model
face_app = FaceAnalysis(name="buffalo_l")
face_app.prepare(ctx_id=0, det_size=(160, 160))

# Function to load embeddings from .npz file
def load_embeddings(file_path="embeddings.npz"):
    if os.path.exists(file_path):
        data = np.load(file_path, allow_pickle=True)
        return {name: data[name] for name in data.files}  # Convert to dict
    return {}

# Save embeddings to .npz file
def save_embeddings(embeddings, file_path="embeddings.npz"):
    np.savez(file_path, **embeddings)

# Load known face embeddings
known_faces = load_embeddings("embeddings.npz")
print(f"Loaded {len(known_faces)} faces for recognition.")

# Function to recognize a face using cosine similarity
def recognize_face(test_embedding, threshold=0.4):
    best_match = "Unknown"
    best_similarity = threshold
    for name, embedding in known_faces.items():
        similarity = 1 - cosine(embedding, test_embedding)  # Cosine similarity
        if similarity > best_similarity:
            best_match = name
            best_similarity = similarity
    return best_match if best_match != "Unknown" else None

# Initialize video capture
cap = cv2.VideoCapture(src)

detection_timestamps = {}
buffer_time = 100  # Buffer time in seconds

csv_filename = "face_detections.csv"
if not os.path.exists(csv_filename):
    with open(csv_filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Name", "Timestamp"])

# Store recognized face data for frontend
face_data_log = []

@app.get("/", response_class=HTMLResponse)
def get_home():
    with open("static/index.html", "r") as file:
        return HTMLResponse(content=file.read())

# WebSocket endpoint to detect frontend refresh and restart video processing
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global cap
    await websocket.accept()
    print("WebSocket connected - Restarting video stream.")
    
    # Restart video on connection
    cap.release()
    cap = cv2.VideoCapture(src)

    await websocket.send_text("Video restarted")
    await websocket.close()

# Video streaming generator with better error handling
async def generate_frames(request: Request):
    try:
        global cap
        while True:
            ret, frame = cap.read()
            if not ret:
                cap.release()
                cap = cv2.VideoCapture(src)  # Restart video if it stops
                continue
            
            faces = face_app.get(frame)  # Detect and extract face embeddings
            current_time = time.time()
            
            for face in faces:
                face_embedding = face.embedding
                name = recognize_face(face_embedding)
                
                if name:
                    x1, y1, x2, y2 = face.bbox.astype(int)
                    color = (0, 255, 0)  # Green for recognized faces
                    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                    cv2.putText(frame, name, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
                    
                    if name not in detection_timestamps or (current_time - detection_timestamps[name]) > buffer_time:
                        detection_timestamps[name] = current_time
                        timestamp = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(current_time))
                        
                        # Append to face_data_log for frontend
                        face_data_log.append({"name": name, "timestamp": timestamp})

                        # Save to CSV
                        with open(csv_filename, mode='a', newline='') as file:
                            writer = csv.writer(file)
                            writer.writerow([name, timestamp])

            _, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

            # Check if client disconnected
            if await request.is_disconnected():
                print("Client disconnected from video stream.")
                break  # Stop streaming

    except asyncio.CancelledError:
        print("Streaming request was cancelled.")
        raise  # Ensure FastAPI handles cleanup

@app.get("/video_feed")
async def video_feed(request: Request):
    return StreamingResponse(generate_frames(request), media_type="multipart/x-mixed-replace; boundary=frame")

# API to get recognized face data
@app.get("/get_face_data", response_model=List[Dict[str, str]])
async def get_face_data():
    """ API to fetch logged face data (Name, Timestamp). """
    return face_data_log

# API to register a face
@app.post("/upload_face")
def upload_face(name: str = Form(...), file: UploadFile = File(...)):
    try:
        image_data = np.frombuffer(file.file.read(), np.uint8)
        image = cv2.imdecode(image_data, cv2.IMREAD_COLOR)
        faces = face_app.get(image)
        
        if not faces:
            raise HTTPException(status_code=400, detail="No face detected in the image.")
        
        face_embedding = faces[0].embedding  # Take the first detected face
        known_faces[name] = face_embedding  # Store in dictionary
        save_embeddings(known_faces)  # Save updated embeddings
        
        return {"message": f"Face for {name} registered successfully."}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# API to delete a face
@app.post("/delete_face")
def delete_face(name: str = Form(...)):
    try:
        if name in known_faces:
            del known_faces[name]  # Remove the face encoding
            save_embeddings(known_faces)  # Save updated embeddings
            return {"message": f"Face for {name} deleted successfully."}
        else:
            raise HTTPException(status_code=404, detail="Face not found.")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
