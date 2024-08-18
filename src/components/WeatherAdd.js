import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTint, faCompress, faEye, faWind, faCloudRain, faCloud, faSun } from '@fortawesome/free-solid-svg-icons';

const WeatherAdd = ({ weather }) => {
  if (!weather || !weather.list) return null;

  // UTC 시간 계산
  const utcNow = new Date();
  const utcSunrise = new Date(weather.city.sunrise * 1000);
  const utcSunset = new Date(weather.city.sunset * 1000);

  // 도시의 시간대 오프셋 (초 단위)을 이용해 현지 시간 계산
  const cityNow = new Date(utcNow.getTime() + weather.city.timezone * 1000);
  const citySunrise = new Date(utcSunrise.getTime() + weather.city.timezone * 1000);
  const citySunset = new Date(utcSunset.getTime() + weather.city.timezone * 1000);

  // 일출부터 일몰까지의 총 시간 (밀리초)
  const totalDayTime = citySunset - citySunrise;

  // 일출부터 현재까지의 시간 (밀리초)
  const timePassedSinceSunrise = cityNow - citySunrise;

  // 현재 시간의 위치를 퍼센트로 계산 (0% ~ 100%)
  const currentTimePercentage = Math.min(Math.max((timePassedSinceSunrise / totalDayTime) * 100, 0), 100);

  // 일몰까지 남은 시간 계산
  const timeUntilSunset = citySunset - cityNow;
  const hoursUntilSunset = Math.floor(timeUntilSunset / (1000 * 60 * 60));
  const minutesUntilSunset = Math.floor((timeUntilSunset % (1000 * 60 * 60)) / (1000 * 60));

  // 일출 후 3시간 이상 지났는지 확인
  const threeHoursAfterSunrise = new Date(citySunrise.getTime() + 3 * 60 * 60 * 1000);
  const isMoreThanThreeHoursAfterSunrise = cityNow > threeHoursAfterSunrise;

  // 현재 시간이 일몰 이전인지 확인
  const isBeforeSunset = cityNow < citySunset;

  // 일몰 시간 표시 조건
  const showSunsetTime = isMoreThanThreeHoursAfterSunrise && isBeforeSunset;

  const formatTime = (date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    });
  };

  const formatHour = (date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    });
  };

  return (
    <div>
      <div className="weather-add common-body mb-4">
        <h3>시간별 예보</h3>
        <div className="hourly-forecast">
          {weather.list.slice(0, 8).map((forecast, index) => {
            const forecastTime = new Date(forecast.dt * 1000 + weather.city.timezone * 1000);
            return (
              <div key={index} className="hourly-item">
                <p>{formatHour(forecastTime)}</p>
                <img src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`} alt="weather icon" />
                <p>{Math.round(forecast.main.temp)}°C</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="weather-add common-body mb-4">
        <h3>일출 - 일몰</h3>
        <div className="sunrise-sunset">
          <div className="sun-graph">
            <div className="sun-progress" style={{ width: `${currentTimePercentage}%` }}></div>
            <FontAwesomeIcon icon={faSun} className="sun-icon" style={{ left: `${currentTimePercentage}%` }} />
            {showSunsetTime && (
              <span className='sunset-time' style={{ left: `${currentTimePercentage}%` }}>
                <p>일몰까지: {hoursUntilSunset}시간 {minutesUntilSunset}분</p>
              </span>
            )}
          </div>
          <div className="time-labels">
            <span><FontAwesomeIcon className="city-sunrise-icon" icon={faSun} /> 일출: {formatTime(citySunrise)}</span>
            <span><FontAwesomeIcon className="city-sunset-icon" icon={faSun} /> 일몰: {formatTime(citySunset)}</span>
          </div>
        </div>
      </div>

      <div className="weather-add common-body">
        <div className="weather-details">
          <div className="weather-detail-item">
            <FontAwesomeIcon icon={faTint} />
            <h5>습도</h5>
            <p>{weather.list[0].main.humidity}%</p>
          </div>
          <div className="weather-detail-item">
            <FontAwesomeIcon icon={faCompress} />
            <h5>기압</h5>
            <p>{weather.list[0].main.pressure} hPa</p>
          </div>
          <div className="weather-detail-item">
            <FontAwesomeIcon icon={faEye} />
            <h5>가시성</h5>
            <p>{weather.list[0].visibility / 1000} km</p>
          </div>
          <div className="weather-detail-item">
            <FontAwesomeIcon icon={faWind} />
            <h5>풍속</h5>
            <p>{weather.list[0].wind.speed} m/s</p>
          </div>
          <div className="weather-detail-item">
            <FontAwesomeIcon icon={faCloudRain} />
            <h5>강수 확률</h5>
            <p>{Math.round(weather.list[0].pop * 100)}%</p>
          </div>
          <div className="weather-detail-item">
            <FontAwesomeIcon icon={faCloud} />
            <h5>구름량</h5>
            <p>{weather.list[0].clouds.all}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherAdd;