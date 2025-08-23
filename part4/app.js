const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogRouter = require('./controllers/blog')
const usersRouter = require('./controllers/user')
const middleware = require('./utils/middleware')

const app = express()

logger.info('connection to', config.MONGODB_URI)

mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(express.json())

app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)

app.use(middleware.errorHandler)

module.exports = app