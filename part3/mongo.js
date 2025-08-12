const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://aryan56raj342:${password}@cluster0.u1xgkjm.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', phonebookSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const personName = process.argv[3]
  const personNumber = process.argv[4]

  const person = new Person({
    name: personName,
    number: personNumber,
  })

  person.save().then(() => {
    console.log(`added ${personName} number ${personNumber} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('invalid number of arguments')
  mongoose.connection.close()
}