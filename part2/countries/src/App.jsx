import { useEffect, useState } from 'react'
import Display from './components/Display'
import countryServices from './services/Countries'

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
    <div>
      <div>find countries <input value={inputVal} onChange={handleInputValChange} /></div>
      <Display filteredCountries={filteredCountries} />
    </div>
  )
}

export default App
