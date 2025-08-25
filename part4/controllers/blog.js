const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body
  const decodedUser = jwt.verify(request.token, process.env.SECRET)
  if (!decodedUser) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedUser.id)
  if (!user) {
    return response.status(401).json({ error: 'UserId missing or invalid' })
  }

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

blogRouter.delete('/:id', async (request, response) => {
  const decodedUser = jwt.verify(request.token, process.env.SECRET)
  if (!decodedUser) return response.status(401).json({ error: 'token invalid' })

  const [user, blog] = await Promise.all([
    User.findById(decodedUser.id),
    Blog.findById(request.params.id)
  ])

  if (!user) return response.status(401).json({ error: 'Unauthorized: user not found' })
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