import DisplayWeather from "./DisplayWeather"

const DisplayCountry = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>
      <h2>Languages</h2>
      <ul>{Object.values(country.languages).map(l => <li key={l}>{l}</li>)}</ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
      <h2>Weather in {country.capital}</h2>
      <DisplayWeather capitalCoord={country.capitalInfo} />
    </div>
  )
}

const Display = ({ filteredCountries, onShow }) => {
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
      {filteredCountries.map(
        c => <div key={c.cca3}> {c.name.common} <button onClick={() => onShow(c.cca3)}>show</button> </div> 
      )}
    </div>
  )
}

export default Display