import { useState } from "react";
import axios from "axios";
import { MagnifyingGlass } from "react-loader-spinner";
import Alert from "./Alert";
import Select from 'react-select';
import { AwesomeButton } from "react-awesome-button";
import 'react-awesome-button/dist/styles.css';
import weatherImageDefault1 from './images/default1.png';
import weatherImageDefault2 from './images/default2.png';
import weatherImageDefault3 from './images/default3.png';

function App() {
  const API_KEY = '<YOUR API KEY FROM openweathermap.org>';

  const [data, setData] = useState('');
  const [location, setLocation] = useState('');
  const [unit, setUnit] = useState('metric');
  const [symbol, setSymbol] = useState('°C');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const handleUnitChange = (selectedOption) => {
    setUnit(selectedOption.value);
    setSymbol(selectedOption.value === 'metric' ? '°C' : '°F');
    setData(null);
  };

  const unitOptions = [
    { value: 'metric', label: 'Celcius (°C)' },
    { value: 'imperial', label: 'Fahrenheit (°F)' },
  ];

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=${unit}`;

  const handleSearch = () => {
    setIsLoading(true);
    axios.get(url).then(response => {
      setData(response?.data);
    })
      .catch((error) => {
        setError(error.response?.data?.message || 'An error occurred');
        setData(null);
      })
      .finally(() => {
        setIsLoading(false);
        setLocation('');
        setTimeout(() => {
          setError(null);
        }, 3000);
      });
  }
  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="app"  style={{  paddingTop: '5rem' }}>
      {isLoading && (
        <div className="loading-spinner">
          <MagnifyingGlass visible={true} height={80} width={80}
            ariaLabel="MagnifyingGlass-loading"
            glassColor="#bbc1c3"
            color="#394c54"
          />
        </div>
      )}
      {error && (
        <Alert
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
      <div className="search" >
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Search Location"
          type="text"
        />

        <AwesomeButton style={{ marginLeft: '1rem' , color:'blue' ,     
        '--button-primary-color': '#9ce0ffff',
        '--button-primary-color-dark': '#003147ff',  
        '--button-primary-color-light': '#000000ff',
        '--button-primary-color-hover': '#59cbffff',
        '--button-primary-text-color': '#000000ff',  }} type="primary" onPress={() => handleSearch()}>
          {'Search'}
        </AwesomeButton>
      </div>

      <div className="date">
        <p> {new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {data ?
        <div className="container" style={{marginTop:'-3rem'}}>
          <div className="top">
            <div className='location'>
              <p>{data.name}</p>
            </div>
            <div className="temp">
              <h1>{data.main.temp.toFixed()}{symbol}</h1>
              <div className="icon">
                <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`} alt="Weather Icon" />
              </div>
            </div>

            <div className="description">
              <h2>{data.weather[0].main}</h2>
            </div>
          </div>
          <div className="bottom">
            <div className="feels">
              <p>Feels Like</p>
              <p className="bold">{data.main.feels_like.toFixed()}{symbol}</p>
            </div>
            <div className="humidity">
              <p>Humidity</p>
              <p className="bold">{data.main.humidity}%</p>
            </div>
            <div className="temp_max">
              <p>Max Temp</p>
              <p className="bold">{data.main.temp_max.toFixed()}{symbol}</p>
            </div>
            <div className="wind">
              <p>Wind Speed</p>
              <p className="bold">{data.wind.speed.toFixed()}m/s</p>
            </div>
          </div>
        </div>
        :    <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                gap:'5rem'
              }}>
          <img className="weather-default-image" src={weatherImageDefault1} alt="weather-default-image" style={{width:'15rem' , height:'10rem'}}/>
          <img className="weather-default-image" src={weatherImageDefault2} alt="weather-default-image" style={{width:'15rem' , height:'10rem' , marginTop:'4rem'}}/>
          <img className="weather-default-image" src={weatherImageDefault3} alt="weather-default-image" style={{width:'15rem' , height:'10rem' , marginTop:'7rem'}}/>
        </div> }

      <div className="unit-dropdown" style={{  paddingTop: '5rem', marginLeft: '5rem' }}>
        <Select
          options={unitOptions}
          value={unitOptions.find(option => option.value === unit)}
          onChange={handleUnitChange}
          className="custom-select"
          styles={{
            control: provided => ({
              ...provided,
              backgroundColor: "rgba(0,0,0,0.1)",
              border: "1px solid rgba(255, 255, 255, 0.8)",
              borderRadius: "25px",
              padding: ".2rem .5rem",
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: "white",
              color: "black",
            }), singleValue: (provided) => ({
              ...provided,
              color: "#ffffff",
            })
          }}
        />
      </div>

      <footer className="footer">
        <h4>&copy; {new Date().getFullYear()} Weather app. All rights reserved.</h4>
      </footer>
    </div>
  );
}

export default App;
