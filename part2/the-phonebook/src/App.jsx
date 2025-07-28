import { useState, useEffect } from 'react'
import phonebookServices from './services/phonebook'
import Person from './components/Person'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')

  useEffect(() => {
    phonebookServices
      .getAll()
      .then(persons => setPersons(persons))
  }, [])

  const handleAdd = (event) => {
    event.preventDefault()

    const contains = persons.find((person) => person.name === newName)
    if (contains) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const nameObj = {
      name: newName,
      number: newNumber,
    }

    phonebookServices
      .create(nameObj)
      .then(entry => {
        setPersons(persons.concat(entry))
        setNewName('')
        setNewNumber('')
      })
  }

  const removeEntry = (id) => {
    if (window.confirm(`Delete ${(persons.find(p => p.id === id)).name}`)) {
      phonebookServices
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterNameChange = (event) => setFilterName(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterName={filterName} handleFilterNameChange={handleFilterNameChange} />

      <h3>add a new</h3>
      <PersonForm 
        onSubmit={handleAdd}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      
      <h3>Numbers</h3>
      <Person 
        filterName={filterName} 
        persons={persons}
        onDeleteClick={removeEntry}
      />
    </div>
  )
}

export default App