const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

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

test('a valid blog can be added', async () => {
  const blogToAdd = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(blogToAdd)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.getBlogsInDB()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes(blogToAdd.title))
})

test('default value for likes is zero', async () => {
  const blogToAdd = {
    title: 'Bitcoin: A Peer-to-Peer Electronic Cash System',
    author: 'Satoshi Nakamoto',
    url: 'null.com',
  }

  await api
    .post('/api/blogs')
    .send(blogToAdd)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.getBlogsInDB()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const blogRecentlyAdded = blogsAtEnd.filter(b => b.title === blogToAdd.title)
  assert.strictEqual(blogRecentlyAdded[0].likes, 0)
})

test('handles missing title appropriately', async () => {
  const missingTitleBlog = {
    author: 'Brian Kerningham',
    url: 'null.com',
    likes: 34,
  }

  await api
    .post('/api/blogs')
    .send(missingTitleBlog)
    .expect(400)
})

test('handles missing url appropriately', async () => {
  const missingURLBlog = {
    title: 'Algorithms',
    author: 'Robert Sedgewick',
    likes: 55,
  }

  await api
    .post('/api/blogs')
    .send(missingURLBlog)
    .expect(400)
})

test('deletes blogs appropriately', async () => {
  const blogToDelete = (await helper.getBlogsInDB())[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAfterDeletion = await helper.getBlogsInDB()
  assert.strictEqual(helper.initialBlogs.length - 1, blogsAfterDeletion.length)
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