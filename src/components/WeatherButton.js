import React from 'react';
import { Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const WeatherButton = ({ cities, selectedCity, onSelect, onSearchClick }) => {
  return (
    <div className="button-box common-body w-100 mb-3">
      {cities.map((city) => (
        <Button
          key={city}
          variant={city === selectedCity ? 'light' : 'outline-light'}
          onClick={() => onSelect(city)}
        >
          {city === 'current' ? '현재 위치' : city}
        </Button>
      ))}
      <Button variant="outline-light" onClick={onSearchClick}>
        <FontAwesomeIcon icon={faSearch} /> 검색
      </Button>
    </div>
  );
};

export default WeatherButton;