import React from 'react';
import { Button } from 'react-bootstrap';

const ShareButton = ({ weather, onKweatherClick }) => {
  const shareWeather = () => {
    if (!weather || !weather.list || weather.list.length === 0) {
      console.error('Weather data is not available');
      return;
    }

    const currentWeather = weather.list[0];
    const text = `현재 ${weather.city.name}의 날씨: ${Math.round(currentWeather.main.temp)}°C, ${currentWeather.weather[0].description}`;

    if (navigator.share) {
      navigator.share({
        title: '오늘의 날씨',
        text: text,
        url: window.location.href,
      })
      .then(() => console.log('공유 성공'))
      .catch((error) => console.log('공유 실패', error));
    } else {
      alert(text);
    }
  };

  return (
    <div>
      <Button onClick={shareWeather} disabled={!weather || !weather.list || weather.list.length === 0}>
        날씨 정보 공유하기
      </Button>
      {/* <Button onClick={onKweatherClick}>대한민국 전국 날씨</Button> */}
    </div>
  );
};

export default ShareButton;