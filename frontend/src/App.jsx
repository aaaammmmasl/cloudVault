import { useEffect, useState } from "react";

import FileList from "./components/FileList";
import FileUpload from "./components/FileUpload";
import FileSearch from "./components/FileSearch";

import {
  getFiles,
  searchFiles,
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

      const updatedFile = await renameFile(file.id, newName);

      setFiles((currentFiles) =>
        currentFiles.map((item) =>
          item.id === updatedFile.id ? updatedFile : item,
        ),
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(file) {
    const confirmed = window.confirm(`Delete "${file.originalName}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteFile(file.id);

      setFiles((currentFiles) =>
        currentFiles.filter((item) => item.id !== file.id),
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSearch(query) {
    try {
      setError("");

      const data = await searchFiles(query);

      setFiles(data);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleUploadSuccess(uploadedFile) {
    setFiles((currentFiles) => [uploadedFile, ...currentFiles]);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <p className="text-zinc-400">Loading CloudVault...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-yellow-400">Cloud</span>
              Vault
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Internal file management
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-yellow-400" />

            <span className="text-sm text-zinc-400">System Online</span>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Upload */}
        <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Upload file</h2>

            <p className="mt-1 text-sm text-zinc-500">
              Add a file to your CloudVault storage.
            </p>
          </div>

          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </section>

        {/* Files */}
        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold">Your files</h2>

              <p className="mt-1 text-sm text-zinc-300">
                {files.length} {files.length === 1 ? "file" : "files"}
              </p>
            </div>
          </div>

          <div className="mb-5">
            <FileSearch onSearch={handleSearch} />
          </div>

          <FileList
            files={files}
            onDownload={handleDownload}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        </section>
      </div>
    </main>
  );
}

export default App;
