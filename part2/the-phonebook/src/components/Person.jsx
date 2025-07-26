const PersonLine = ({ person }) => <div>{person.name} {person.number}</div>

const Person = ({ filterName, persons }) => {
  const filter = () => {
    return persons.filter((person) => person.name.trim().toLowerCase() === filterName.trim().toLowerCase())
  }

  const filteredPersons = filterName.length === 0 ? persons : filter()

  return (
    <div>
      {filteredPersons.map((person) => <PersonLine key={person.id} person={person}/>)}
    </div>
  )
}

export default Person