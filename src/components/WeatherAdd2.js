import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureArrowDown, faTemperatureArrowUp } from '@fortawesome/free-solid-svg-icons';

const WeatherAdd2 = ({ weather }) => {
  if (!weather || !weather.list || weather.list.length === 0) return null;

  // 날짜별로 데이터 그룹화
  const dailyData = weather.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = {
        temps: [],
        icon: item.weather[0].icon,
        dt: item.dt
      };
    }
    acc[date].temps.push(item.main.temp);
    return acc;
  }, {});

  // 각 날짜의 최고/최저 기온 계산
  const dailyForecast = Object.keys(dailyData).map(date => ({
    date,
    maxTemp: Math.max(...dailyData[date].temps),
    minTemp: Math.min(...dailyData[date].temps),
    icon: dailyData[date].icon,
    dt: dailyData[date].dt
  })).slice(1, 6);  // 오늘을 제외한 5일 예보

  const getDayName = (timestamp) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[new Date(timestamp * 1000).getDay()];
  };

  return (
    <div className="weather-forecast common-body">
      <h3>5일 예보</h3>
      <div className="forecast-list">
        {dailyForecast.map((day, index) => (
          <div key={index} className="forecast-item">
            <p>({getDayName(day.dt)}){new Date(day.dt * 1000).toLocaleDateString().slice(5)}</p>
            <img 
              src={`http://openweathermap.org/img/wn/${day.icon}.png`} 
              alt="weather icon" 
            />
            <p>
              <FontAwesomeIcon icon={faTemperatureArrowUp} /> {Math.round(day.maxTemp)}°C
            </p>
            <p>
              <FontAwesomeIcon icon={faTemperatureArrowDown} /> {Math.round(day.minTemp)}°C
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherAdd2;