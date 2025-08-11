require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const morgan = require('morgan')

app = express()

app.use(express.json())
app.use(express.static('dist'))

morgan.token('data', (request, response) => {
    if (request.method === 'POST') {
        return JSON.stringify(request.body)
    } else {
        return ' '
    }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/info', (request, response, next) => {
    Person.countDocuments({})
        .then((count) => {
            response.send(`
                <div>Phonebook has info for ${count} people</div>                
                <br />
                <div> ${new Date()} </div>
            `)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndUpdate(request.params.id)
        .then(person => {
            person.name = request.body.name
            person.number = request.body.number
            return person.save().then(savedPerson => {
                response.json(savedPerson)
            })
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(200).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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

    const person = new Person({ name, number })
    person.save()
        .then(savedPerson => {
        response.json(savedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})