import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'
const api = import.meta.env.VITE_SOME_KEY

const getAll = () => {
  return axios
    .get(`${baseUrl}/all`)
    .then(response => response.data)
}

const getWeather = (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}`
  return axios
    .get(url)
    .then(response => response.data)
}

export default { getAll, getWeather }