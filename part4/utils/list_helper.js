const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let total = 0
    blogs.forEach(blog => {
        total += blog.likes
    });
    return total
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    let favorite = blogs[0]
    blogs.forEach(blog => {
        if (favorite.likes < blog.likes) {
            favorite = blog
        }
    })
    return favorite
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    const count = lodash.countBy(blogs, (blog) => blog.author)
    const authorWithMostBlogs = Object.keys(count).reduce((a, b) => count[a] > count[b] ? a : b)
    return { author: authorWithMostBlogs, blogs: count[authorWithMostBlogs] }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
}