import React, { useEffect, useState } from "react";
import styles from "./styles/Table.module.css";
import { useApi } from "../context/ApiContext";

const Table = () => {
  const { getFaceData } = useApi(); // Use API context function
  const [detectedFaces, setDetectedFaces] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFaceData(); // Fetch face data from backend
        setDetectedFaces(data);
      } catch (error) {
        console.error("Error fetching face data:", error);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className={styles.tableContainer}>
      <h2>Detected Faces</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {detectedFaces.length > 0 ? (
            detectedFaces.map((face, index) => (
              <tr key={index}>
                <td>{face.name}</td>
                <td>{face.timestamp}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className={styles.noData}>
                No faces detected yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
