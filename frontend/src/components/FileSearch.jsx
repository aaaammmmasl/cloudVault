import { useState } from "react";

function FileSearch({ onSearch }) {
  const [query, setQuery] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    onSearch(query);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search files..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <button type="submit">Search</button>
    </form>
  );
}

export default FileSearch;
