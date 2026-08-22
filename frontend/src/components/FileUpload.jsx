import { useState } from "react";
import { uploadFile } from "../services/fileApi";

function FileUpload({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  function handleFileChange(event) {
    setSelectedFile(event.target.files[0]);
  }

  async function handleUpload() {
    if (!selectedFile) {
      return;
    }

    try {
      setUploading(true);

      const uploadedFile = await uploadFile(selectedFile);

      onUploadSuccess(uploadedFile);

      setSelectedFile(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
      />

      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

export default FileUpload;