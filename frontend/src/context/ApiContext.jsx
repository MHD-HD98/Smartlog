import { createContext, useContext } from 'react';
import axios from 'axios';

const ApiContext = createContext();

const api = axios.create({
  baseURL: 'http://192.168.29.103:8000',
});

export const ApiProvider = ({ children }) => {
  const getVideoFeed = () => {
    return `${api.defaults.baseURL}/video_feed`;
  };

  const restartVideo = async () => {
    try {
      const response = await api.post('/restart_video');
      return response.data;
    } catch (error) {
      console.error('Error restarting video:', error);
      throw error;
    }
  };

  const uploadFace = async (name, file) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('file', file);
      const response = await api.post('/upload_face', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading face:', error);
      throw error.response?.data?.detail || 'Unknown error occurred';
    }
  };

  const deleteFace = async (name) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      const response = await api.post('/delete_face', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting face:', error);
      throw error.response?.data?.detail || 'Unknown error occurred';
    }
  };

  // New API function to fetch face data
  const getFaceData = async () => {
    try {
      const response = await api.get('/get_face_data');
      return response.data; // Returns an array of face records [{ name: 'John', timestamp: '2025-03-20 10:15:30' }, ...]
    } catch (error) {
      console.error('Error fetching face data:', error);
      throw error.response?.data?.detail || 'Unknown error occurred';
    }
  };

  return (
    <ApiContext.Provider value={{ getVideoFeed, restartVideo, uploadFace, deleteFace, getFaceData }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  return useContext(ApiContext);
};
