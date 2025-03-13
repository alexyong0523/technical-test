import React, { useState, useEffect } from "react";
import "./App.css";
import ImageUpload from "./components/ImageUpload";
import DataEditor from "./components/DataEditor";
import axios from "axios";

const API_FETCH_URL = "http://127.0.0.1:8000/api/fetch-api-data"; // Laravel route to fetch & store data
const API_DISPLAY_URL = "http://127.0.0.1:8000/api/data"; // Laravel route to retrieve stored data

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch & process data on backend
      await axios.get(API_FETCH_URL);
      getStoredData(); // Retrieve and display processed data
    } catch (error) {
      console.error("Error fetching API data:", error);
    }
  };

  const getStoredData = async () => {
    try {
      const response = await axios.get(API_DISPLAY_URL);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching stored data:", error);
    }
  };

  return (
    <div>
      <h2>Image Upload</h2>
      <ImageUpload />

      <DataEditor />
    </div>
  );
}

export default App;
