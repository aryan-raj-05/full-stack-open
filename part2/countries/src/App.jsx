import { useEffect, useState } from 'react'
import countryServices from './services/Countries'

const CountryNameLine = ({ name }) => <div> {name} </div>

const DisplayCountry = ({ country }) => {

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>

      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map(l => <li key={l}>{l}</li>)}
      </ul>

      <img src={country.flags.png} alt='Flag of the Country' />
    </div>
  )
}

const Display = ({ filteredCountries }) => {
  if (filteredCountries.length === 0) return

  if (filteredCountries.length === 1) {
    return (
      <DisplayCountry country={filteredCountries[0]} />
    )
  }

  if (filteredCountries.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  }

  return (
    <div>
      {filteredCountries.map(c => <CountryNameLine key={c.name.common} name={c.name.common} />)}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([]) // store all the countries
  const [inputVal, setInputVal] = useState('') // store user input
  const [filteredCountries, setFilteredCountries] = useState([]) // store the countries as they are filtered according to the input

  useEffect(() => {
    countryServices
      .getAll()
      .then((data) => {
        setCountries(data)
      })
  }, [])

  const handleInputValChange = (event) => {
    const name = event.target.value
    if (name.length === 0) {
      setFilteredCountries([])
      setInputVal('')
      return
    }
    const input = name.toLowerCase()
    setInputVal(name)
    setFilteredCountries(countries.filter(
      c => c.name.common.toLowerCase().includes(input)
    ))
  }

  return (
    <form>
      <div>find countries <input value={inputVal} onChange={handleInputValChange} /></div>
      <Display filteredCountries={filteredCountries} />
    </form>
  )
}

export default App
