import { useState } from "react";

function FileSearch({ onSearch }) {
  const [query, setQuery] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    onSearch(query);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
        >
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="m20 20-4-4" />
        </svg>

        <input
          type="text"
          placeholder="Search files..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3.5 pl-12 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-yellow-400/60 focus:ring-1 focus:ring-yellow-400/20"
        />
      </div>

      <button
        type="submit"
        className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-6 py-3.5 text-sm font-semibold text-yellow-400 transition hover:border-yellow-400/50 hover:bg-yellow-400/20"
      >
        Search
      </button>
    </form>
  );
}

export default FileSearch;
