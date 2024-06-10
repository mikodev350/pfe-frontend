import React, { useState } from 'react';
import ButtonSearchFormDetail from '../searchForm/ButtonSearchFormDetail';
import SearchResults from './SearchResults';
import SocialMediaNavbar from '../SocialMediaNavbar';

const AdvancedSearchPage = () => {
  const [results, setResults] = useState([]);

  const handleSearchResults = (filters) => {
    // Requête pour obtenir les résultats de recherche en fonction des filtres
    const params = new URLSearchParams(filters).toString();
    fetch(`http://localhost:1337/api/custom-search/advanced?${params}`)
      .then(response => response.json())
      .then(data => setResults(data))
      .catch(error => console.error('Error fetching search results:', error));
  };

  return (
    <div>
      <SocialMediaNavbar />
      <ButtonSearchFormDetail onFilterChange={handleSearchResults} />
      {results.length > 0 && <SearchResults results={results} />}
    </div>
  );
};

export default AdvancedSearchPage;
