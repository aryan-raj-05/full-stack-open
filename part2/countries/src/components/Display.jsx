const DisplayCountry = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>
      <h2>Languages</h2>
      <ul>{Object.values(country.languages).map(l => <li key={l}>{l}</li>)}</ul>
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
      {filteredCountries.map(c => <div key={c.name.common}> {c.name.common} </div> )}
    </div>
  )
}

export default Display