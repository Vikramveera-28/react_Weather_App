import { useEffect, useState } from 'react'
import './App.css'
import CloudIcon from './assets/Images/Cloud.png'
import PartyCloudIcon from './assets/Images/Party-Cloud.png'
import RainyIcon from './assets/Images/Rainy.png'
import SearchIcon from './assets/Images/Search.png'
import SnowIcon from './assets/Images/Snow.png'
import SunnyIcon from './assets/Images/Sunny.png'
import ThunderIcon from './assets/Images/Thunder.png'
import WindIcon from './assets/Images/Wind.png'
import HumidityIcon from './assets/Images/Humidity.png'


const WeatherDetails = ({ icon, dayTime, temp, city, country, lat, log, humidity, wind }) => {
	return (
		<div className="weather-fade-in">
			<div className="image">
				<img src={icon} alt="Weather Icon" />
			</div>
			<div className="temp">{temp}°C</div>
			<div className="location">{city}<span className='day'>({dayTime})</span></div>
			<div className="country">{country}</div>
			<div className="card">
				<div>
					<span className="label">Latitude</span>
					<span className="value">{lat}</span>
				</div>
				<div>
					<span className="label">Logitude</span>
					<span className="value">{log}</span>
				</div>
			</div>
			<div className="data-container">
				<div className="element">
					<img src={HumidityIcon} alt="Humidity" className='icon' />
					<div className="data">
						<div className="humidity-percent">{humidity}%</div>
						<div className="text">Humidity</div>
					</div>
				</div>
				<div className="element">
					<img src={WindIcon} alt="Wind Speed" className='icon' />
					<div className="data">
						<div className="wind-percent">{wind} km/h</div>
						<div className="text">Wind Speed</div>
					</div>
				</div>
			</div>
		</div>
	)
}



function App() {
	const [icon, setIcon] = useState(SunnyIcon)
	const [dayTime, setdayTime] = useState("01d")
	const [temp, setTemp] = useState(0)
	const [city, setCity] = useState("Chennai")
	const [country, setCountry] = useState("IN")
	const [lat, setLat] = useState(0)
	const [log, setLog] = useState(0)
	const [humidity, setHumidity] = useState(0)
	const [wind, setWind] = useState(0)
	const [text, setText] = useState("Chennai")

	const [cityNotFound, setCityNotFound] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const weatherIconMap = {
		"01d": SunnyIcon,
		"01n": SunnyIcon,
		"02d": PartyCloudIcon,
		"02n": PartyCloudIcon,
		"03d": CloudIcon,
		"03n": CloudIcon,
		"04d": CloudIcon,
		"04n": CloudIcon,
		"09d": RainyIcon,
		"09n": RainyIcon,
		"10d": RainyIcon,
		"10n": RainyIcon,
		"11d": ThunderIcon,
		"11n": ThunderIcon,
		"13d": SnowIcon,
		"13n": SnowIcon,
	}

	const search = async () => {
		setLoading(true)
		setError(null)
		setCityNotFound(false)

		let API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=a670916528f5718e0bce2aab0fa25b71&units=Metric`;
		try {
			let response = await fetch(API_URL)
			let data = await response.json()
			if (data.cod == "404") {
				setCityNotFound(true)
				return
			}
			setHumidity(data.main.humidity);
			setWind(data.wind.speed);
			setTemp(Math.floor(data.main.temp));
			setCity(data.name);
			setCountry(data.sys.country);
			setLat(data.coord.lat)
			setLog(data.coord.lon)
			const weatherIconCode = data.weather[0].icon;
			setIcon(weatherIconMap[weatherIconCode] || SunnyIcon)
			setdayTime(weatherIconCode || "01d")
		} catch (err) {
			setError("An error occurred while fetching data.")
		} finally {
			setLoading(false);
		}
	}

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			search();
		}
	}

	useEffect(() => {
		search();
	}, [])

	return (
		<div className="container">
			<div className="input-container">
				<input
					type="text"
					className='cityInput'
					value={text}
					onChange={(e) => setText(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder='Search City...'
				/>
				<div className="search-icon" onClick={() => search()}>
					<img src={SearchIcon} alt="Search" />
				</div>
			</div>

			{loading && <div className="loading-message">Updating weather...</div>}
			{error && <div className="error-message">{error}</div>}
			{cityNotFound && <div className="city-not-found">City not found</div>}

			{!loading && !cityNotFound && !error && (
				<WeatherDetails
					icon={icon}
					temp={temp}
					city={city}
					country={country}
					lat={lat}
					log={log}
					humidity={humidity}
					wind={wind}
					dayTime={dayTime}
				/>
			)}
		</div>
	)
}

export default App