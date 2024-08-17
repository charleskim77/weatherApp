import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { ClipLoader } from 'react-spinners';
import WeatherButton from './components/WeatherButton';
import WeatherBox from './components/WeatherBox';
import WeatherAdd from './components/WeatherAdd';
import WeatherAdd2 from './components/WeatherAdd2';
import Search from './components/Search';
import WeatherTip from './components/WeatherTip';
import ShareButton from './components/ShareButton';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);

// API 키
const API_KEY = '80be82dba0d6182c077885677b606d33';

function App() {
  const [weather, setWeather] = useState(null);  // 날씨 데이터
  const [city, setCity] = useState('');  // 선택 도시
  const [loading, setLoading] = useState(false);  // 로딩 상태
  const [backgroundClass, setBackgroundClass] = useState('');  // 배경이미지 클래스
  const [showSearch, setShowSearch] = useState(false);  // 검색 컴포넌트 표시 여부

  // 현재 위치의 날씨 정보 가져오기
  const getWeatherByCurrentLocation = useCallback(async (lat, lon) => {
    try {
      setLoading(true);
      let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;
      let response = await fetch(url);
      let data = await response.json();
      console.log('Weather data:', data);
      setWeather(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  // 도시 이름으로 날씨 정보 가져오기
  const getWeatherByCity = useCallback(async (cityName) => {
    try {
      setLoading(true);
      let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=kr`;
      let response = await fetch(url);
      let data = await response.json();
      console.log('Weather data:', data);
      setWeather(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  // 현재 위치 가져오기
  const getCurrentLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      getWeatherByCurrentLocation(position.coords.latitude, position.coords.longitude);
    }, (error) => {
      getWeatherByCity('Seoul');  // 위치 정보를 가져올 수 없을 때 서울 날씨 표시
    });
  }, [getWeatherByCurrentLocation, getWeatherByCity]);

  // 배경 클래스를 업데이트
  const updateBackgroundClass = useCallback(() => {
    if (weather && weather.list && weather.list.length > 0) {
      const currentWeather = weather.list[0];
      const currentHour = new Date().getHours();
      const isDay = currentHour >= 7 && currentHour < 19;
      let weatherMain = currentWeather.weather[0].main.toLowerCase();

      // 날씨 상태에 따른 배경 클래스
      const weatherMap = {
        'clear': 'clear',
        'clouds': 'clouds',
        'rain': 'rain',
        'snow': 'snow',
        'thunderstorm': 'thunderstorm',
        'drizzle': 'rain',
        'mist': 'mist',
        'smoke': 'mist',
        'haze': 'mist',
        'dust': 'mist',
        'fog': 'mist',
        'sand': 'mist',
        'ash': 'mist',
        'squall': 'mist',
        'tornado': 'mist'
      };

      weatherMain = weatherMap[weatherMain] || 'mist';

      let newClass = isDay ? 'day' : 'night';
      newClass += `-${weatherMain}`;

      console.log('Weather main:', weatherMain);
      console.log('New background class:', newClass);

      setBackgroundClass(newClass);
    }
  }, [weather]);

  // 컴포넌트가 마운트될 때 현재 위치의 날씨를 가져옴
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  // 날씨 데이터가 변경될 때마다 배경 클래스를 업데이트
  useEffect(() => {
    if (weather) {
      updateBackgroundClass();
    }
  }, [weather, updateBackgroundClass]);

  // 선택된 도시가 변경될 때마다 해당 도시의 날씨를 가져옴
  useEffect(() => {
    if (city && city !== 'current') {
      getWeatherByCity(city);
    } else if (city === 'current') {
      getCurrentLocation();
    }
  }, [city, getWeatherByCity, getCurrentLocation]);

  // 도시 선택
  const handleCitySelect = useCallback((selectedCity) => {
    setCity(selectedCity);
  }, []);

  // 검색 버튼 클릭 
  const handleSearchClick = useCallback(() => {
    setShowSearch(true);
  }, []);

  // 검색 창 닫기 
  const handleSearchClose = useCallback(() => {
    setShowSearch(false);
  }, []);

  // 배경 이미지 URL 가져오기
  const getBackgroundImage = () => {
    console.log('Current background class:', backgroundClass);
    if (!backgroundClass) return '';
    const imagePath = `/images/${backgroundClass}.jpg`;
    console.log('Image path:', imagePath);
    return imagePath;
  };

  return (
    <div className="App" style={{ backgroundImage: `url(${getBackgroundImage()})` }}>
      <div className="bg-overlay"></div>
      <Container className='weatherbox pt-4'>
        {loading ? (
          <div className="spinner-container">
            <ClipLoader color="#f88c6b" loading={loading} size={300} />
          </div>
        ) : (
          <>
            <Row className="mb-4">
              <Col>
                <WeatherButton
                  cities={['current', 'London', 'Toronto', 'Berlin', 'Brasilia']}
                  selectedCity={city}
                  onSelect={handleCitySelect}
                  onSearchClick={handleSearchClick}
                />
              </Col>
            </Row>
            <Row className="mb-4">
              <Col>
                <WeatherBox weather={weather} />
              </Col>
            </Row>
            <Row className="mb-4">
              <Col>
                <WeatherAdd weather={weather} />
              </Col>
            </Row>
            <Row className="mb-4">
              <Col>
                <WeatherAdd2 weather={weather} />
              </Col>
            </Row>
            <Row className="mb-4">
              <Col>
                <WeatherTip weather={weather} />
              </Col>
            </Row>
            <Row className="pb-4">
              <Col>
                <ShareButton weather={weather} />
              </Col>
            </Row>
            <Search
              onSearch={getWeatherByCity}
              show={showSearch}
              handleClose={handleSearchClose}
            />
          </>
        )}
      </Container>
    </div>
  );
}

export default App;