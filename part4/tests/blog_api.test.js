const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
  await helper.addLoginUser()
})

describe('database and server are communicating', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct number of blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs have unique identifier named id', async () => {
    const blogs = await helper.getBlogsInDB()
    assert(blogs.every(blog => Object.prototype.hasOwnProperty.call(blog, 'id')))
  })
})

describe('adding new blogs', () => {
  test('a valid blog can be added', async () => {
    const loggedInUser = await api.post('/api/login').send(helper.loginUser)

    const blogToAdd = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loggedInUser.body.token}`)
      .send(blogToAdd)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.getBlogsInDB()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    assert.strictEqual(blogToAdd.title,   response.body.title)
    assert.strictEqual(blogToAdd.author,  response.body.author)
    assert.strictEqual(blogToAdd.url,     response.body.url)
    assert.strictEqual(blogToAdd.likes,   response.body.likes)

    assert.strictEqual(response.body.user, (await User.findOne({ username: helper.loginUser.username }))._id.toString())
  })

  test('blogs can not be added without authorization', async () => {
    const testBlog = {
      title: 'Attention is all You Need',
      author: 'Whoever',
      url: 'test.com',
      likes: 97
    }

    await api
      .post('/api/blogs')
      .send(testBlog)
      .expect(401)
  })

  test('if there is no value for likes then it should default to zero', async () => {
    const loggedInUser = await api.post('/api/login').send(helper.loginUser)

    const blogToAdd = {
      title: 'Bitcoin: A Peer-to-Peer Electronic Cash System',
      author: 'Satoshi Nakamoto',
      url: 'null.com',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loggedInUser.body.token}`)
      .send(blogToAdd)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.getBlogsInDB()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    assert.strictEqual(response.body.title, blogToAdd.title)
    assert.strictEqual(response.body.author, blogToAdd.author)
    assert.strictEqual(response.body.url, blogToAdd.url)
    assert.strictEqual(response.body.likes, 0)

    assert.strictEqual(response.body.user, (await User.findOne({ username: helper.loginUser.username }))._id.toString())
  })

  test('returns 400 when title is missing', async () => {
    const loggedInUser = await api.post('/api/login').send(helper.loginUser)

    const missingTitleBlog = {
      author: 'Brian Kerningham',
      url: 'null.com',
      likes: 34,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loggedInUser.body.token}`)
      .send(missingTitleBlog)
      .expect(400)
  })

  test('returns 400 when URL is missing', async () => {
    const loggedInUser = await api.post('/api/login').send(helper.loginUser)

    const missingURLBlog = {
      title: 'Algorithms',
      author: 'Robert Sedgewick',
      likes: 55,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loggedInUser.body.token}`)
      .send(missingURLBlog)
      .expect(400)
  })
})

describe('deletion of blogs', () => {
  test('should succeed with code 204 if id is valid', async () => {
    const loggedInUser = await api.post('/api/login').send(helper.loginUser)

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loggedInUser.body.token}`)
      .send(helper.newBlog)

    const blogsAfterAddition = await helper.getBlogsInDB()

    await api
      .delete(`/api/blogs/${response.body.id}`)
      .set('Authorization', `Bearer ${loggedInUser.body.token}`)
      .expect(204)

    const blogsAfterDeletion = await helper.getBlogsInDB()
    assert.strictEqual(blogsAfterDeletion.length, blogsAfterAddition.length - 1)
  })
})

test('can update already existing blogs', async () => {
  const blogToUpdate = (await helper.getBlogsInDB())[0]
  const newBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 100 }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newBlog)
    .expect(200)

  assert.strictEqual(response.body.likes, newBlog.likes)
  assert.strictEqual(response.body.id, newBlog.id)
})

after(async () => {
  await mongoose.connection.close()
})