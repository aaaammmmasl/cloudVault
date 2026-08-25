function FileList({ files, onDownload, onRename, onDelete }) {
  if (files.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 px-6 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400/10 text-yellow-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-7 w-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 3h7l4 4v14H7V3Z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5" />
          </svg>
        </div>

        <h3 className="mt-5 text-base font-semibold text-zinc-200">
          No files found
        </h3>

        <p className="mt-2 text-sm text-zinc-500">
          Upload a file or try a different search.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60">
      {files.map((file, index) => (
        <div
          key={file.id}
          className={`group flex flex-col gap-5 p-5 transition hover:bg-zinc-800/40 sm:flex-row sm:items-center sm:justify-between ${
            index !== files.length - 1 ? "border-b border-zinc-800" : ""
          }`}
        >
          {/* File information */}
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 3h7l4 4v14H7V3Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 3v5h5"
                />
              </svg>
            </div>

            <div className="min-w-0">
              <h3
                className="truncate text-sm font-medium text-zinc-100"
                title={file.originalName}
              >
                {file.originalName}
              </h3>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-300">
                <span>{file.mimeType}</span>

                <span className="text-zinc-500">•</span>

                <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>

                <span className="text-zinc-500">•</span>

                <span>{new Date(file.uploadedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => onDownload(file)}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-400"
            >
              Download
            </button>

            <button
              onClick={() => onRename(file)}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-400"
            >
              Rename
            </button>

            <button
              onClick={() => onDelete(file)}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-red-900/60 hover:bg-red-950/30 hover:text-red-400"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FileList;
