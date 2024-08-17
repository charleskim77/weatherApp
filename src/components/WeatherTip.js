import React from 'react';

const WeatherTip = ({ weather }) => {
  if (!weather || !weather.list || weather.list.length === 0) return null;

  const currentWeather = weather.list[0];

  const getTip = () => {
    const temp = currentWeather.main.temp;
    const description = currentWeather.weather[0].description;

    if (temp < 10) {
      return '추운 날씨입니다. 따뜻하게 입으세요!';
    } else if (temp > 25) {
      return '더운 날씨입니다. 시원하게 입으세요!';
    } else if (description.includes('비')) {
      return '비가 오고 있습니다. 우산을 챙기세요!';
    } else {
      return '좋은 날씨입니다. 야외 활동을 즐겨보세요!';
    }
  };

  return (
    <div className="weather-tip">
      <h2>오늘의 날씨 팁</h2>
      <p>{getTip()}</p>
    </div>
  );
};

export default WeatherTip;
