import React, { useState, useEffect, useCallback } from 'react';

const Search = ({ onSearch, show, handleClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch('/city.list.json')
      .then(response => response.json())
      .then(data => setCities(data))
      .catch(error => console.error('Error loading city data:', error));
  }, []);

  const getSuggestions = useCallback((value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength < 2 ? [] : cities.filter(city =>
      city.name.toLowerCase().includes(inputValue)
    ).slice(0, 20);  // 최대 20개의 추천 결과만 표시
  }, [cities]);

  useEffect(() => {
    setSuggestions(getSuggestions(query));
  }, [query, getSuggestions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
    setQuery('');
    setSuggestions([]);
    handleClose();
  };

  return (
    <div className="search-container" style={{ display: show ? 'block' : 'none' }}>
      <div className="search-header">
        <h5>도시 검색</h5>
        <button className="close-button" onClick={handleClose}>닫기</button>
      </div>

      <div className="search-body">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="영문 검색 (2글자 이상 자동 완성...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <div>
            {suggestions.map((city, index) => (
              <div key={index} onClick={() => {
                setQuery(city.name);
                onSearch(city.name);
                setSuggestions([]);
                handleClose();
              }} className="suggestion-item">
                {city.name}, {city.country}
              </div>
            ))}
          </div>
          
          <button type="submit" className="search-button">검색</button>
        </form>
      </div>
    </div>
  );
};

export default Search;
