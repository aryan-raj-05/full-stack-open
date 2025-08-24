const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body
  const user = (await User.find({}))[0].id
  const blog = new Blog({
    title,
    author,
    user,
    url,
    likes,
  })

  const savedBlog = await blog.save()
  return response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  return response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body
  const newBlogToUpdate = {
    title,
    author,
    url,
    likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    newBlogToUpdate,
    { new: true, runValidators: true, context: 'query' }
  )

  if (!updatedBlog) {
    response.status(404).end()
  }

  return response.status(200).json(updatedBlog)
})

module.exports = blogRouter