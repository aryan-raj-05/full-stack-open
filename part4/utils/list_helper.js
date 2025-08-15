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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
}