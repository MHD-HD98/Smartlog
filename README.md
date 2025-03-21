# Face Recognition Web App

This project is a real-time face recognition system using FastAPI for the backend and React for the frontend. The system processes video streams, detects faces, and identifies them using pre-trained embeddings.

## Features
- **Real-time face recognition** using InsightFace and cosine similarity.
- **Video feed streaming** with detected faces highlighted.
- **User registration & deletion** for new faces.
- **WebSocket support** for real-time updates.
- **Data persistence** with embeddings saved in `.npz` format.
- **CORS enabled** for frontend-backend communication.
- **Face detection logs** stored in a CSV file.

## Pre-requisites
Ensure you have the following installed:
- **Python 3.8+**
- **Node.js & npm** (for frontend)
- **FastAPI** & related dependencies:
  ```bash
  pip install fastapi uvicorn numpy insightface scipy opencv-python-headless python-multipart
  ```
- **React dependencies**:
  ```bash
  cd ui/frontend
  npm install
  ```

## Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo
   ```
2. **Backend Setup:**
   ```bash
   cd ui/backend
   python main.py
   ```
3. **Frontend Setup:**
   ```bash
   cd ui/frontend
   npm run dev
   ```

## Running the Project
1. Start the **FastAPI backend**:
   ```bash
   python main.py
   ```
2. Start the **React frontend**:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser to access the app.

## Code Overview
### **Frontend (React) - `App.jsx`**
- Uses `react-router-dom` for routing.
- **Main Routes:**
  - `/` - Displays **VideoFeed** and **Table** for recognized faces.
  - `/face-control` - Manages registered faces.
  - `/settings` - Placeholder for future features.

### **Backend (FastAPI) - `main.py`**
- Loads **ArcFace** model for face recognition.
- Streams **video feed** with OpenCV.
- Uses **WebSockets** to restart video processing upon frontend refresh.
- Supports **face registration and deletion** via API endpoints.

## API Endpoints
- `GET /video_feed` - Streams real-time video with face recognition.
- `GET /get_face_data` - Fetches recognized face logs.
- `POST /upload_face` - Registers a new face.
- `POST /delete_face` - Removes a registered face.

## License
This project is licensed under the MIT License.

---
Feel free to customize it further based on your requirements!

