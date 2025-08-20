const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    return response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
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