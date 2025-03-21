import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import React Router
import VideoFeed from "./components/VideoFeed";
import styles from "./App.module.css";
import Navbar from "./components/Navbar";
import Table from "./components/Table";
import Controls from "./components/Controls"; // Import Controls component

function App() {
  return (
    <Router>
      <Navbar />
      <div className={styles.container}>
        <Routes>
          {/* Home Page (Face Recognition Table & Video Feed) */}
          <Route path="/" element={
            <>
              <div className={styles.videoSection}>
                <VideoFeed />
              </div>
              <div className={styles.controlsSection}>
                <Table />
              </div>
            </>
          } />

          {/* Face Control Page */}
          <Route path="/face-control" element={<Controls />} />

          {/* Placeholder for Future Settings Page */}
          <Route path="/settings" element={<h2>Settings Page (Coming Soon)</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
