const jwt = require('jsonwebtoken')
const User = require('../models/user')
const logger = require('./logger')

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }
  next(error)
}

const tokenExtracter = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token =  authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedUser = jwt.verify(request.token, process.env.SECRET)
  if (!decodedUser) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const user = await User.findById(decodedUser.id)
  if (!user) {
    return response.status(401).json({ error: 'UserId missing of invalid' })
  }

  request.user = user
  next()
}

module.exports = {
  errorHandler,
  tokenExtracter,
  userExtractor,
}