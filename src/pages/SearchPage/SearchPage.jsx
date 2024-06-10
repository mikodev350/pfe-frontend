import React, { useState } from "react";
import SearchFormDetail from "../../components/searchForm/SearchFormDetail";

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);

  const handleFilterChange = (data) => {
    setSearchResults(data);
  };

  return (
    <div>
      <SearchFormDetail onFilterChange={handleFilterChange} />
      <div>
        {searchResults.length > 0 ? (
          searchResults.map((result) => (
            <div key={result.id}>
              <h3>{result.name}</h3>
              {/* Display other details here */}
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
