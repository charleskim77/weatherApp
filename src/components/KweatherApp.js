import React, { useEffect, useState } from 'react';
import axios from 'axios';
// App.css import 제거 또는 경로 수정

const KweatherApp = ({ goBack }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const API_URL = `https://api.weather.go.kr/weather?serviceKey=${API_KEY}&numOfRows=10&pageNo=1&dataType=JSON&base_date=${today}&base_time=0600&nx=60&ny=127`;
        
        const response = await axios.get(API_URL);
        setWeatherData(response.data);
      } catch (err) {
        console.error('날씨 데이터 가져오기 실패:', err);
        setError('날씨 정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!weatherData) return null;

  return (
    <div className="kweather-app">
      <h2>대한민국 전국 날씨</h2>
      <div className="weather-list">
        {weatherData.response.body.items.item.map((item, index) => (
          <div key={index} className="weather-item">
            <h3>{item.region}</h3>
            <p>온도: {item.temp}°C</p>
            <p>상태: {item.weather}</p>
          </div>
        ))}
      </div>
      <button onClick={goBack} className="back-button">뒤로 가기</button>
    </div>
  );
};

export default KweatherApp;