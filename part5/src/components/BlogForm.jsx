import blogService from '../services/blogs'

const BlogForm = ({ newBlog, setNewBlog, blogs, setBlogs, setNotification }) => {
  const handleSubmit = async (event) => {
    event.preventDefault()

    const response = await blogService.create(newBlog)
    setBlogs(blogs.concat(response))

    setNewBlog({
      title: '',
      author: '',
      url: '',
    })

    setNotification({
      message: `a new blog ${response.title} by ${response.author} added`,
      isError: false,
    })

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            title:
            <input
              type="text"
              value={newBlog.title}
              onChange={({ target }) => setNewBlog({...newBlog, title: target.value})}
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              type="text"
              value={newBlog.author}
              onChange={({ target }) => setNewBlog({...newBlog, author: target.value})}
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              type="text"
              value={newBlog.url}
              onChange={({ target }) => setNewBlog({...newBlog, url: target.value})}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm