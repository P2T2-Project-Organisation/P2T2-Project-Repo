import React from "react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  renderSuggestions: () => JSX.Element | null;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  renderSuggestions,
}) => {
  return (
    <div style={{ position: "relative" }}>
      <form
        onSubmit={handleSearch}
        className="d-flex justify-content-center"
        style={{
          marginTop: "0",
          padding: "10px 0",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div
          className="input-group"
          style={{
            width: "800px",
          }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Search artworks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              height: "40px",
              borderRadius: "20px 0 0 20px",
            }}
          />
          <button
            className="btn btn-primary"
            type="submit"
            style={{
              height: "40px",
              borderRadius: "0 20px 20px 0",
            }}
          >
            Search
          </button>
        </div>
      </form>
      {renderSuggestions()}
    </div>
  );
};

export default SearchBar;
