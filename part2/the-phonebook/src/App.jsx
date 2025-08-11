import { useState, useEffect } from 'react'
import phonebookServices from './services/phonebook'
import Person from './components/Person'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    phonebookServices
      .getAll()
      .then(persons => setPersons(persons))
  }, [])

  const handleAdd = (event) => {
    event.preventDefault()
    const nameObj = {
      name: newName,
      number: newNumber,
    }

    const contains = persons.find((person) => person.name === newName)
    const message = contains 
      ? `${contains.name} is already added to phonebook, replace the old number with a new one?` 
      : null
    if (contains && window.confirm(message)) {
      phonebookServices
        .update(contains.id, nameObj)
        .then((data) => {
          setPersons(persons.map(p => p.name === newName ? data : p))
          setNewName('')
          setNewNumber('')
          setNotification({
            type: 'success',
            message: `Updated ${newName}`
          })
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        })
        .catch(() => {
          setNotification({
            type: 'fail',
            message: `Information of ${newName} has already been removed from server`
          })
          setPersons(persons.filter(p => p.name !== newName))
          setNewName('')
          setNewNumber('')
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        })
      return
    }

    phonebookServices
      .create(nameObj)
      .then(entry => {
        setPersons(persons.concat(entry))
        setNewName('')
        setNewNumber('')
        setNotification({
          type: 'success',
          message: `Added ${newName}`
        })
        setTimeout(() => {
          setNotification(null)
        }, 3000)
      })
      .catch(error => {
        console.log(error.response.data.error)
        setNotification({
          type: 'fail',
          message: error.response.data.error
        })
        setNewName('')
        setNewNumber('')
        setTimeout(() => {
          setNotification(null)
        }, 3000)
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
      <Notification notification={notification} />
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