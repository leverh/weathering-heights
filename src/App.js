import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { Oval } from 'react-loader-spinner';

import './App.css';


function WeatherApp() {
  const [input, setInput] = useState('');
  const [unit, setUnit] = useState('metric'); // metric = Celsius, imperial = Fahrenheit
  const [weatherData, setWeatherData] = useState({
    loading: false,
    data: {},
    error: false,
  });

  const getTemperatureMessage = (temp, currentUnit) => {
    let threshold = currentUnit === 'metric' ? 10 : 50; // 10°C or 50°F
    if (temp < threshold) {
      return "It's too cold for Kate's dance moves out there!";
    } else if (temp >= threshold && temp < (threshold + 10)) {
      return "It's mildly chilly, but you can still try some Wuthering Heights twirls!";
    } else {
      return "Warm enough for a Wuthering Heights outdoor performance!";
    }
  };

  const getCurrentDate = () => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const weekDays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const currentDate = new Date();
    const date = `${weekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
    return date;
  };

  const searchWeather = async (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
      event.preventDefault();
      setInput('');
      // console.log('Button clicked or Enter pressed');
      setWeatherData({ ...weatherData, loading: true });
      const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
      const apiKey = process.env.REACT_APP_API_KEY;
      await axios
        .get(apiUrl, {
          params: {
            q: input,
            units: unit, 
            appid: apiKey,
          },
        })
        .then((res) => {
          console.log('res', res);
          setWeatherData({ data: res.data, loading: false, error: false });
        })
        .catch((error) => {
          setWeatherData({ ...weatherData, data: {}, error: true });
          setInput('');
          console.log('error', error);
        });
    }
  };

  const handleUnitChange = async (selectedUnit) => {
    setUnit(selectedUnit);
    if (weatherData.data.name) {
      setWeatherData({ ...weatherData, loading: true });
      const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
      const apiKey = process.env.REACT_APP_API_KEY;
      try {
        const res = await axios.get(apiUrl, {
          params: {
            q: weatherData.data.name,
            units: selectedUnit,
            appid: apiKey,
          },
        });
        setWeatherData({ data: res.data, loading: false, error: false });
      } catch (error) {
        setWeatherData({ ...weatherData, data: {}, error: true });
        console.log('error', error);
      }
    }
  };
  

  return (
   <div className="background-wrapper">
    <div className="App">
      {!weatherData.data.main && !weatherData.loading && !weatherData.error && (
        <div className="welcome-section">
          {/* Animated clouds */}
          <div className="cloud"></div>
          <div className="cloud"></div>
          <div className="cloud"></div>
          <div className="cloud"></div>
          <div className="cloud"></div>
          <div className="cloud"></div>
          <div className="cloud"></div>

          <div className="welcome-message">
            <h1 className="app-name">Welcome to Weathering Heights!</h1>
            <p className='instruction'>Enter a city name to get started.</p>
          </div>

          <div className="weather-vane">
          <img src="/images/weather-vane.svg" alt="Weather Vane" className="weather-vane-image" />

          </div>

        </div>
      )}
      <div className="search-bar">
  <input
    type="text"
    className="city-search"
    placeholder="Enter City Name..."
    name="query"
    value={input}
    onChange={(event) => setInput(event.target.value)}
    onKeyDown={searchWeather}
  />
  <button 
  type='button'
  className="search-button" 
  onClick={searchWeather}>
    Search
  </button>
  <select
  className="select-dropdown"
  value={unit}
  onChange={(e) => handleUnitChange(e.target.value)}
>
  <option value="metric">Metric (°C, m/s)</option>
  <option value="imperial">Imperial (°F, mph)</option>
</select>

</div>

      {weatherData.loading && (
        <>
          <br />
          <br />
          <Oval type="Oval" color="black" height={100} width={100} />
        </>
      )}
      {weatherData.error && (
        <>
          <br />
          <br />
          <div className="error-message">
            <span className="icon">
              <FontAwesomeIcon icon={faExclamationCircle} />
            </span>
            <span className="text">City not found</span>
          </div>

        </>
      )}

      {weatherData.data && weatherData.data.main && (
        <div>
          <div className="city-name">
            <h2>
              {weatherData.data.name}, <span>{weatherData.data.sys.country}</span>
            </h2>
          </div>
          <div className="date">
            <span>{getCurrentDate()}</span>
          </div>
          <div className="icon-temp">
            <img
              className=""
              src={`https://openweathermap.org/img/wn/${weatherData.data.weather[0].icon}@2x.png`}
              alt={weatherData.data.weather[0].description}
            />
            {Math.round(weatherData.data.main.temp)}
            <sup className="deg">°{unit === 'metric' ? 'C' : 'F'}</sup>
          </div>
          <div className="des-wind">
            <p>{weatherData.data.weather[0].description.toUpperCase()}</p>
            <p>Wind Speed: {weatherData.data.wind.speed}m/s</p>
          </div>
          <div className="temperature-message">
            <p>{getTemperatureMessage(Math.round(weatherData.data.main.temp), unit)}</p>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default WeatherApp;
