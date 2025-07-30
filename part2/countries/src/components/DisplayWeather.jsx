import { useState, useEffect } from 'react'
import countryServices from '../services/Countries'

const DisplayWeather = ({ capitalCoord }) => {
  const [weather, setWeather] = useState(null)
  const [lat, lon] = capitalCoord.latlng

  useEffect(() => {
    countryServices
      .getWeather(lat, lon)
      .then(data => setWeather(data))
  }, [lat, lon])

  if (!weather) return <div></div>

  const temp = (weather.main.temp - 273.15).toFixed(2)
  const weatherIconCode = weather.weather[0].icon
  const iconImageLink = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`
  const windSpeed = (weather.wind.speed).toFixed(2)

  return (
    <div>
      <div>Temperature {temp} Celsius</div>
      <img src={iconImageLink} />
      <div>Wind {windSpeed} m/s</div>
    </div>
  )
}

export default DisplayWeather