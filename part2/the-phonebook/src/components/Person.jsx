const PersonLine = ({ person, onClick }) => {
  return (
    <div>{person.name} {person.number} <button onClick={onClick}>delete</button></div>
  )
}

const Person = ({ filterName, persons, onDeleteClick }) => {
  const filter = () => {
    return persons.filter((person) => person.name.trim().toLowerCase() === filterName.trim().toLowerCase())
  }

  const filteredPersons = filterName.length === 0 ? persons : filter()

  return (
    <div>
      {filteredPersons.map((person) => <PersonLine key={person.id} person={person} onClick={() => onDeleteClick(person.id)} />)}
    </div>
  )
}

export default Person