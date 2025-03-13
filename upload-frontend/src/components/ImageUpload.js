import React, { useState } from "react";
import axios from "axios";
import "./ImageUpload.css"; // Import the CSS file

const ImageUpload = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) {
            setMessage("Please select an image.");
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            setMessage("Invalid file type. Please upload a JPG, PNG, or GIF image.");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setMessage("File size exceeds 2MB. Please upload a smaller file.");
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));
        setMessage("");
    };

    const handleUpload = async () => {
        if (!image) {
            setMessage("Please select an image to upload.");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage("Image uploaded successfully!"); // Success message
        } catch (error) {
            setMessage("Upload failed. Please try again."); // Error message
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="upload-container">
            <div className="upload-card">
                <h2>Upload Your Image</h2>

                {/* File Input */}
                <label className="file-upload-area">
                    <input
                        type="file"
                        accept="image/jpeg, image/png, image/gif"
                        className="file-input"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                    <span>Drag & drop or <span className="browse-text">browse</span> to upload</span>
                    <span className="file-types">Supports JPG, PNG, GIF (Max 2MB)</span>
                </label>

                {/* Preview */}
                {preview && (
                    <div className="preview-container">
                        <img src={preview} alt="Preview" className="preview-image" />
                    </div>
                )}

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    disabled={isUploading || !image}
                    className="upload-button"
                >
                    {isUploading ? "Uploading..." : "Upload Image"}
                </button>

                {/* Message */}
                {message && (
                    <p className={`message ${message.includes("failed") ? "error" : "success"}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;