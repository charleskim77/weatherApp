import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureLow, faTemperatureArrowUp, faTemperatureArrowDown } from '@fortawesome/free-solid-svg-icons';

const WeatherBox = ({ weather }) => {
  if (!weather || !weather.list || weather.list.length === 0) return null;

  const currentWeather = weather.list[0];
  
  // UTC 시간 계산
  const utcTime = new Date(currentWeather.dt * 1000);
  
  // 도시의 시간대 오프셋 (초 단위)을 이용해 현지 시간 계산
  const cityTime = new Date(utcTime.getTime() + weather.city.timezone * 1000);

  // 날짜 및 시간 포맷팅 함수
  const formatDateTime = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    };
    return date.toLocaleString('ko-KR', options);
  };

  // 최고/최저 기온 계산
  const temperatures = weather.list.slice(0, 8).map(item => item.main.temp);
  const maxTemp = Math.max(...temperatures);
  const minTemp = Math.min(...temperatures);

  // 섭씨를 화씨로 변환하는 함수
  const celsiusToFahrenheit = (celsius) => Math.round((celsius * 9/5) + 32);

  return (
    <div className="weather-box common-body">
      <div className="weather-header">
        <h2>{weather.city.name}</h2>
        <p>{formatDateTime(cityTime)}</p>
      </div>
      <div className="weather-content">
        <div className="temperature">
          <h1>
            {Math.round(currentWeather.main.temp)}°C
            <span style={{ fontSize: '0.5em', marginLeft: '5px' }}>
              ({celsiusToFahrenheit(currentWeather.main.temp)}°F)
            </span>
          </h1>
          <p>{currentWeather.weather[0].description}</p>
        </div>
        <div className="weather-item">
          <FontAwesomeIcon icon={faTemperatureLow} />
          체감온도: {Math.round(currentWeather.main.feels_like)}°C
          <span style={{ fontSize: '0.8em', marginLeft: '5px' }}>
            ({celsiusToFahrenheit(currentWeather.main.feels_like)}°F)
          </span>
        </div>
        <div className="weather-item">
          <span>
            <FontAwesomeIcon icon={faTemperatureArrowUp} />
            최고: {Math.round(maxTemp)}°C
            <span style={{ fontSize: '0.8em', marginLeft: '5px' }}>
              ({celsiusToFahrenheit(maxTemp)}°F)
            </span>
          </span>
          <span style={{ marginLeft: '10px' }}>
            <FontAwesomeIcon icon={faTemperatureArrowDown} />
            최저: {Math.round(minTemp)}°C
            <span style={{ fontSize: '0.8em', marginLeft: '5px' }}>
              ({celsiusToFahrenheit(minTemp)}°F)
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeatherBox;