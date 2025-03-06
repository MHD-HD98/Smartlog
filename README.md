# Face Recognition with FastAPI and WebSockets

This project implements a **real-time face recognition system** using **FastAPI**, **InsightFace (ArcFace model)**, and **OpenCV**. It streams video, detects faces, matches them against a stored database, and logs recognition events. It also features **WebSocket integration** to restart video processing when the frontend refreshes.

## 🚀 Features
- **Real-time Face Recognition** using ArcFace model.
- **Video Streaming** via FastAPI (`/video_feed`).
- **Face Registration & Deletion** via API endpoints (`/upload_face`, `/delete_face`).
- **Automatic Video Restart** when the frontend refreshes using WebSockets (`/ws`).
- **Face Logging**: Detected faces and timestamps are stored in `face_detections.csv`.
- **Cross-Origin Resource Sharing (CORS)** enabled for frontend integration.
- **Efficient Face Detection** with a 10-second buffer to prevent redundant logs.

---

## 📌 Prerequisites
Before running the project, ensure you have the following installed:

- **Python 3.8+**
- **pip** (Python package manager)
- **Virtual Environment (Optional but recommended)**
- **Dependencies**: Install via `pip install -r requirements.txt` (See Setup below)

---

## 🛠 Setup Instructions

1. **Clone the Repository**
```bash
 git clone https://github.com/your-username/face-recognition-fastapi.git
 cd face-recognition-fastapi
```

2. **Create a Virtual Environment (Optional but Recommended)**
```bash
python -m venv venv  # For Windows
source venv/bin/activate  # For Mac/Linux
```

3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

4. **Download Face Recognition Model (ArcFace)**
Ensure you have **InsightFace** models downloaded:
```bash
mkdir models
# The InsightFace package will automatically download required models when used.
```

5. **Prepare Static Files & Video Source**
- Place any required HTML files inside the `static/` directory.
- Ensure the video file (`1.mov`) exists in the root directory.

---

## ▶️ Running the Project

1. **Start the FastAPI Server**
```bash
uvicorn main:app --host localhost --port 8000
```

2. **Access the API & Video Stream**
- Open `http://localhost:8000/` in your browser.
- Stream the processed video at `http://localhost:8000/video_feed`.

---

## 📜 Code Overview

### **1️⃣ Main Components**
| File | Description |
|------|-------------|
| `main.py` | Core FastAPI app with video streaming, face recognition, and WebSocket handling. |
| `static/` | Contains frontend HTML files. |
| `face_detections.csv` | Stores detected face timestamps. |
| `embeddings.npz` | Stores registered face embeddings. |

### **2️⃣ Key Functionalities**
#### **🔹 Face Recognition & Registration**
- **Face detection and recognition**: Extracts embeddings using ArcFace and compares them with stored faces.
- **API for face registration**: `/upload_face` allows adding new faces.
- **API for face deletion**: `/delete_face` removes stored face embeddings.

#### **🔹 Video Streaming & WebSocket Integration**
- **`/video_feed`**: Streams processed frames with detected faces.
- **`/ws`**: Restarts video processing when the frontend refreshes.

#### **🔹 Data Storage & Logging**
- **`embeddings.npz`**: Stores registered face embeddings persistently.
- **`face_detections.csv`**: Logs detected faces with timestamps.

---

## 🤝 Contributing
Feel free to submit issues and pull requests to improve this project!

---

## 📄 License
This project is licensed under the MIT License.

