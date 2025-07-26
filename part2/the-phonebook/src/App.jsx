import { useState } from 'react'

const DisplayLine = ({ person }) => <div>{person.name} {person.number}</div>

const Display = ({ persons }) => {
  return (
    <div>
      {persons.map((person) => <DisplayLine key={person.name} person={person}/>)}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([{ name: 'Arto Hellas', number: '040-1234567' }]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleAdd = (event) => {
    event.preventDefault()

    const contains = persons.find((person) => person.name === newName)
    if (contains) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const nameObj = {
      name: newName,
      number: newNumber
    }

    setPersons(persons.concat(nameObj))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleAdd}>
        <div>name: <input value={newName} onChange={handleNameChange}/></div>
        <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
        <div><button type="submit">add</button></div>
      </form>
      
      <h2>Numbers</h2>
      <Display persons={persons} />
    </div>
  )
}

export default App