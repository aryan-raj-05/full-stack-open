const express = require('express')
const morgan = require('morgan')
app = express()

app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

morgan.token('data', (request, response) => {
    if (request.method === 'POST') {
        return JSON.stringify(request.body)
    } else {
        return ' '
    }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const count = persons.length
    const date = new Date()
    response.send(`
        <div>Phonebook has info for ${count} people</div>
        <br />
        <div> ${date} </div>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const note = persons.find(p => p.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

const genID = () => {
    return Math.floor(Math.random() * 999999)
}

app.post('/api/persons', (request, response) => {
    const { name, number } = request.body
    if (!name && !number) {
        return response.status(400).json({
            error: 'name and number is missing'
        })
    }
    
    if (!name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }

    if (!number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    if (persons.find(p => p.name === name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: name,
        number: number,
        id: genID()
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})