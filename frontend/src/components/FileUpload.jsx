import { useState } from "react";
import { uploadFile } from "../services/fileApi";

function FileUpload({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  function handleFileChange(event) {
    setSelectedFile(event.target.files[0] || null);
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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <label className="flex flex-1 cursor-pointer items-center gap-4 rounded-xl border border-dashed border-zinc-700 bg-zinc-950/50 px-5 py-4 transition hover:border-yellow-400/60 hover:bg-zinc-950">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16V4m0 0L8 8m4-4 4 4M5 20h14"
            />
          </svg>
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-200">
            {selectedFile ? selectedFile.name : "Choose a file to upload"}
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            {selectedFile
              ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
              : "Maximum file size: 20 MB"}
          </p>
        </div>

        <input type="file" onChange={handleFileChange} className="hidden" />
      </label>

      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="rounded-xl bg-yellow-400 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

export default FileUpload;
