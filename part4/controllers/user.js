const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.post('/', async (request, response) => {
    const { username, password, name } = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        passwordHash,
        name
    })

    const savedUser = await user.save()
    return response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

module.exports = usersRouter