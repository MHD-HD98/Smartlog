import { useState } from 'react';
import styles from './styles/Controls.module.css';
import { useApi } from '../context/ApiContext';

const Controls = () => {
  const { restartVideo, uploadFace, deleteFace } = useApi();

  // State for restart video
  const [restartStatus, setRestartStatus] = useState(null);
  const [restartMessage, setRestartMessage] = useState('');

  // State for upload face
  const [uploadName, setUploadName] = useState('');
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  // State for delete face
  const [deleteName, setDeleteName] = useState('');
  const [deleteStatus, setDeleteStatus] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');

  const handleRestartVideo = async () => {
    setRestartStatus('loading');
    setRestartMessage('Restarting video...');

    try {
      const response = await restartVideo();
      setRestartStatus('success');
      setRestartMessage(response.message);
      setTimeout(() => {
        setRestartStatus(null);
        setRestartMessage('');
      }, 3000);
    } catch (error) {
      setRestartStatus('error');
      // Extract string from error object
      const errorMessage = error.message || 'Failed to restart video. Please try again.';
      setRestartMessage(errorMessage);
      setTimeout(() => {
        setRestartStatus(null);
        setRestartMessage('');
      }, 3000);
    }
  };

  const handleUploadFace = async (e) => {
    e.preventDefault();
    if (!uploadName || !file) {
      setUploadStatus('error');
      setUploadMessage('Please provide both a name and an image file.');
      setTimeout(() => {
        setUploadStatus(null);
        setUploadMessage('');
      }, 3000);
      return;
    }

    setUploadStatus('loading');
    setUploadMessage('Uploading face...');

    try {
      const response = await uploadFace(uploadName, file);
      setUploadStatus('success');
      setUploadMessage(response.message);
      setUploadName('');
      setFile(null);
      setTimeout(() => {
        setUploadStatus(null);
        setUploadMessage('');
      }, 3000);
    } catch (error) {
      setUploadStatus('error');
      // Extract string from error object
      const errorMessage = typeof error === 'string' ? error : error.detail || error.message || 'Failed to upload face. Please try again.';
      setUploadMessage(errorMessage);
      setTimeout(() => {
        setUploadStatus(null);
        setUploadMessage('');
      }, 3000);
    }
  };

  const handleDeleteFace = async (e) => {
    e.preventDefault();
    if (!deleteName) {
      setDeleteStatus('error');
      setDeleteMessage('Please enter a name to delete.');
      setTimeout(() => {
        setDeleteStatus(null);
        setDeleteMessage('');
      }, 3000);
      return;
    }

    setDeleteStatus('loading');
    setDeleteMessage('Deleting face...');

    try {
      const response = await deleteFace(deleteName);
      setDeleteStatus('success');
      setDeleteMessage(response.message);
      setDeleteName('');
      setTimeout(() => {
        setDeleteStatus(null);
        setDeleteMessage('');
      }, 3000);
    } catch (error) {
      setDeleteStatus('error');
      // Extract string from error object
      const errorMessage = typeof error === 'string' ? error : error.detail || error.message || 'Failed to delete face. Please try again.';
      setDeleteMessage(errorMessage);
      setTimeout(() => {
        setDeleteStatus(null);
        setDeleteMessage('');
      }, 3000);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Lenok SmartLog</h2>

      {/* Upload Face */}
      <div className={styles.section}>
        <h3>Upload Face</h3>
        <input
          type="text"
          placeholder="Enter Name"
          value={uploadName}
          onChange={(e) => setUploadName(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          className={styles.uploadBtn}
          onClick={handleUploadFace}
          disabled={uploadStatus === 'loading'}
        >
          {uploadStatus === 'loading' ? 'Uploading...' : 'Upload & Register'}
        </button>
        {uploadStatus && (
          <p
            className={
              uploadStatus === 'error'
                ? styles.errorText
                : styles.successText
            }
          >
            {uploadMessage}
          </p>
        )}
      </div>

      {/* Delete Face */}
      <div className={styles.section}>
        <h3>Delete Face</h3>
        <input
          type="text"
          placeholder="Enter Name to Delete"
          value={deleteName}
          onChange={(e) => setDeleteName(e.target.value)}
        />
        <button
          className={styles.deleteBtn}
          onClick={handleDeleteFace}
          disabled={deleteStatus === 'loading'}
        >
          {deleteStatus === 'loading' ? 'Deleting...' : 'Delete Face'}
        </button>
        {deleteStatus && (
          <p
            className={
              deleteStatus === 'error'
                ? styles.errorText
                : styles.successText
            }
          >
            {deleteMessage}
          </p>
        )}
      </div>

      {/* Restart Button */}
      {/* <button
        className={styles.restartBtn}
        onClick={handleRestartVideo}
        disabled={restartStatus === 'loading'}
      >
        {restartStatus === 'loading' ? 'Restarting...' : 'Restart Video'}
      </button>
      {restartStatus && (
        <p
          className={
            restartStatus === 'error'
              ? styles.errorText
              : styles.successText
          }
        >
          {restartMessage}
        </p>
      )} */}
    </div>
  );
};

export default Controls;