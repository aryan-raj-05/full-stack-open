const blogRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  const user = request.user

  const blog = new Blog({
    title,
    author,
    user: user.id,
    url,
    likes,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  return response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).json({ error: 'Blog not found' })

  if (user._id.toString() !== blog.user.toString()) {
    return response.status(403).json({ error: 'Forbidden not the blog owner' })
  }

  user.blogs = user.blogs.filter(b => b.toString() !== request.params.id)
  await user.save()

  await blog.deleteOne()

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