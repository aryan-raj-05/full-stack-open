const { after, test, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const helper = require('./test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

describe('creating users', () => {
  test('should add user if username is unique and password is long enough', async () => {
    const savedUser = await api
      .post('/api/users')
      .send(helper.uniqueUser)
      .expect(201)

    const usersAtEnd = await helper.getUsersInDB()
    assert.strictEqual(savedUser.body.username, helper.uniqueUser.username)
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)
  })

  test('should fail if username is not unique', async () => {
    await api
      .post('/api/users')
      .send(helper.notUniqueUser)
      .expect(400)
  })

  test('should fail if username is too short', async () => {
    await api
      .post('/api/users')
      .send(helper.userWithShortUsername)
      .expect(400)
  })

  test('should fail if password is missing', async () => {
    await api
      .post('/api/users')
      .send(helper.userWithoutPassword)
      .expect(400)
  })

  test('should fail if password is too short', async () => {
    await api
      .post('/api/users')
      .send(helper.userWithShortPassword)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})