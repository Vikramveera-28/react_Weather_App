import { useEffect, useState } from 'react'
import './App.css'
// import './assets/Bootsrap/css/bootstrap.min.css'
import CloudIcon from './assets/Images/Cloud.png'
import PartyCloudIcon from './assets/Images/Party-Cloud.png'
import RainyIcon from './assets/Images/Rainy.png'
import SearchIcon from './assets/Images/Search.png'
import SnowIcon from './assets/Images/Snow.png'
import SunnyIcon from './assets/Images/Sunny.png'
import ThunderIcon from './assets/Images/Thunder.png'
import WindIcon from './assets/Images/Wind.png'
import HumidityIcon from './assets/Images/Humidity.png'


const WeatherDetails = ({icon, dayTime, temp, city, country, lat, log, humidity, wind}) => {
	return(
		<>
			<div className="image">
				<img src={icon} alt="Image" />
			</div>
			<div className="temp">{temp}°C</div>
			<div className="location">{city}<span className='day'>({dayTime})</span></div>
			<div className="country">{country}</div>
			<div className="card">
				<div>
					<span className="lat">Latitude</span>
					<span>{lat}</span>
				</div>
				<div>
					<span className="log">Logitude</span>
					<span>{log}</span>
				</div>
			</div>
			<div className="data-container">
				<div className="element">
					<img src={HumidityIcon} alt="Humidity Icon" className='icon'/>
					<div className="data">
						<div className="humidity-percent">{humidity}%</div>
						<div className="text">Humidity</div>
					</div>
				</div>
				<div className="element">
					<img src={WindIcon} alt="Wind Icon" className='icon'/>
					<div className="data">
						<div className="wind-percent">{wind} km/h</div>
						<div className="text">Wind Speed</div>
					</div>
				</div>
			</div>
		</>
	)
}



function App() {
	const [icon, setIcon] = useState(SnowIcon)
	const [dayTime, setdayTime] = useState("01d")
	const [temp, setTemp] = useState(0)
	const [city, setCity] = useState("")
	const [country, setCountry] = useState("")
	const [lat, setLat] = useState(0)
	const [log, setLog] = useState(0)
	const [humidity, setHumidity] = useState(0)
	const [wind, setWind] = useState(0)
	const [text, setText] = useState("Chennai")

	const [cityNotFound, setCityNotFound] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const weatherIconMap = {
		"01d" : SunnyIcon,
		"01n" : SunnyIcon,
		"02d" : PartyCloudIcon,
		"02n" : PartyCloudIcon,
		"03d" : CloudIcon,
		"03n" : CloudIcon,
		"04d" : CloudIcon,
		"04n" : CloudIcon,
		"09d" : RainyIcon,
		"09n" : RainyIcon,
		"10d" : RainyIcon,
		"10n" : RainyIcon,
		"11d" : ThunderIcon,
		"11n" : ThunderIcon,
		"13d" : SnowIcon,
		"13n" : SnowIcon,
	}

	const search = async() => {
		let API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=a670916528f5718e0bce2aab0fa25b71&units=Metric`;
		try {
			let response = await fetch(API_URL)
			let data = await response.json()
			if(data.cod == "404"){
				console.error("City not Found")
				setCityNotFound(true)
				setLoading(false)
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
			setCityNotFound(false)
		} catch (error) {
			console.error("An error occurred: ", error.message)
		} finally {
			setLoading(false);
		}
	}
	const handleKeyDown = (e) => {
		if(e.key === "Enter"){
			search();
		}
	}
	useEffect(() => {
		search();
	}, [])
	return(
		<>
			<div className="container">
				<div className="input-container">
					<input
						type="text"
						className='cityInput'
						value={text}
						onChange={(e) => setText(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder='Search City'
					/>
				<div className="search-icon" onClick={() => search()}>
					<img src={SearchIcon} alt="SearchIcon" />
				</div>
				</div>
				{loading && <div className="loading-message">Loading...</div>}
				{error && <div className="error-message">{error}</div>}
				{cityNotFound && <div className="city-not-found">City Not Fount</div>}
				{!loading && !cityNotFound && <WeatherDetails
					icon={icon}
					temp={temp}
					city={city}
					country={country}
					lat={lat}
					log={log}
					humidity={humidity}
					wind={wind}
					dayTime={dayTime}
				/>}
			</div>
		</>
	)
}

export default App
