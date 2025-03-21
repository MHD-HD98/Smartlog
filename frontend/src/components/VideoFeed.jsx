import { useState, useEffect } from 'react';
import styles from './styles/VideoFeed.module.css';
import { useApi } from '../context/ApiContext';

const VideoFeed = () => {
  const [videoAvailable, setVideoAvailable] = useState(null);
  const { getVideoFeed } = useApi();

  useEffect(() => {
    const checkVideoFeed = async () => {
      try {
        setTimeout(() => {
          setVideoAvailable(true);
        }, 2000);
      } catch (error) {
        console.error('Error checking video feed:', error);
        setVideoAvailable(false);
      }
    };

    checkVideoFeed();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className={styles.videoContainer}>
      {videoAvailable === null ? (
        <div className={styles.loaderContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Checking video availability...</p>
        </div>
      ) : videoAvailable ? (
        <img
          src={getVideoFeed()}
          alt="Live Video Feed"
          className={styles.videoFrame}
          onError={() => setVideoAvailable(false)}
        />
      ) : (
        <div className={styles.noVideoContainer}>
          <p className={styles.noVideoText}>No Live Video Available Right Now!</p>
        </div>
      )}
    </div>
  );
};

export default VideoFeed;