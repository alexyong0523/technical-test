import React, { useState } from "react";
import axios from "axios";
import "./DataEditor.css";

const DataEditor = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedBody, setUpdatedBody] = useState("");
  const [selectedPosts, setSelectedPosts] = useState([]); // Track selected posts
  const [error, setError] = useState(null);

  // Fetch API data
  const fetchApiData = async () => {
    setError(null);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/fetch-api-data");
      setPosts(response.data);
    } catch (error) {
      setError("Failed to fetch API data");
      console.error("Error fetching API data:", error);
    }
  };

  // Handle Edit button click
  const handleEdit = (post) => {
    setEditingPost(post.id);
    setUpdatedTitle(post.title);
    setUpdatedBody(post.body);
  };

  // Handle changes to the title or body fields
  const handleUpdate = (postId) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, title: updatedTitle, body: updatedBody } : post
    );
    setPosts(updatedPosts);
    setEditingPost(null); // Exit editing mode
  };

  // Handle Checkbox Change
  const handleCheckboxChange = (postId) => {
    if (selectedPosts.includes(postId)) {
      // If already selected, remove it
      setSelectedPosts(selectedPosts.filter((id) => id !== postId));
    } else {
      // If not selected, add it
      setSelectedPosts([...selectedPosts, postId]);
    }
  };

  // Handle Save button (Save selected posts to DB)
  const handleSave = async () => {
    try {
      // Filter the selected posts
      const postsToSave = posts.filter((post) => selectedPosts.includes(post.id));

      // Save each selected post to the backend
      await Promise.all(
        postsToSave.map((post) =>
          axios.post("http://127.0.0.1:8000/api/store-api-data", {
            title: post.title,
            body: post.body,
          })
        )
      );

      // Clear selected posts
      setSelectedPosts([]);
      alert("Selected data saved successfully!");
    } catch (error) {
      console.error("Error saving API data:", error);
      alert("Failed to save data.");
    }
  };

  return (
    <div className="data-editor">
      <h2 className="editor-title">API Data</h2>
      <button className="fetch-button" onClick={fetchApiData}>
        Fetch API Data
      </button>

      {error && <p className="error-message">{error}</p>}

      <ul className="posts-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id} className="post-item">
              <div className="post-header">
                <input
                  type="checkbox"
                  checked={selectedPosts.includes(post.id)}
                  onChange={() => handleCheckboxChange(post.id)}
                  className="post-checkbox"
                />
                {editingPost === post.id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={updatedTitle}
                      onChange={(e) => setUpdatedTitle(e.target.value)}
                      className="edit-input"
                      placeholder="Title"
                    />
                    <textarea
                      value={updatedBody}
                      onChange={(e) => setUpdatedBody(e.target.value)}
                      className="edit-textarea"
                      placeholder="Body"
                      rows={6} // Increase the number of visible rows
                    />
                    <button className="update-button" onClick={() => handleUpdate(post.id)}>
                      Update
                    </button>
                  </div>
                ) : (
                  <div className="post-content">
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-body">{post.body}</p>
                    <button className="edit-button" onClick={() => handleEdit(post)}>
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <p className="no-data">No data available.</p>
        )}
      </ul>

      {selectedPosts.length > 0 && (
        <button className="save-button" onClick={handleSave}>
          Save Selected
        </button>
      )}
    </div>
  );
};

export default DataEditor;