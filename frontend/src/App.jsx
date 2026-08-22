import { useEffect, useState } from "react";
import FileList from "./components/FileList";
import FileUpload from "./components/FileUpload";

import {
  getFiles,
  getDownloadUrl,
  renameFile,
  deleteFile,
} from "./services/fileApi";

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadFiles() {
    try {
      setError("");

      const data = await getFiles();

      setFiles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFiles();
  }, []);

  function handleDownload(file) {
    window.location.href = getDownloadUrl(file.id);
  }

  async function handleRename(file) {
    const newName = window.prompt(
      "Enter the new file name:",
      file.originalName,
    );

    if (newName === null) {
      return;
    }

    try {
      setError("");

      const updatedFile = await renameFile(
        file.id,
        newName,
      );

      setFiles((currentFiles) =>
        currentFiles.map((item) =>
          item.id === updatedFile.id
            ? updatedFile
            : item,
        ),
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(file) {
    const confirmed = window.confirm(
      `Delete "${file.originalName}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteFile(file.id);

      setFiles((currentFiles) =>
        currentFiles.filter(
          (item) => item.id !== file.id,
        ),
      );
    } catch (err) {
      setError(err.message);
    }
  }

  function handleUploadSuccess(uploadedFile) {
    setFiles((currentFiles) => [
      ...currentFiles,
      uploadedFile,
    ]);
  }

  if (loading) {
    return <p>Loading files...</p>;
  }

  return (
    <main>
      <h1>CloudVault</h1>

      {error && <p>{error}</p>}

      <FileUpload
        onUploadSuccess={handleUploadSuccess}
      />

      <FileList
        files={files}
        onDownload={handleDownload}
        onRename={handleRename}
        onDelete={handleDelete}
      />
    </main>
  );
}

export default App;