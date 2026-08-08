function FileList({ files, onDownload, onRename, onDelete }) {
  if (files.length === 0) {
    return <p>No files found.</p>;
  }

  return (
    <div>
      {files.map((file) => (
        <div key={file.id}>
          <h3>{file.originalName}</h3>

          <p>Type: {file.mimeType}</p>
          <p>Size: {file.size} bytes</p>
          <p>Uploaded: {new Date(file.uploadedAt).toLocaleString()}</p>

          <button onClick={() => onDownload(file)}>Download</button>

          <button onClick={() => onRename(file)}>Rename</button>

          <button onClick={() => onDelete(file)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default FileList;
