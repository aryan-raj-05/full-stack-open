import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from "./components/Togglable.jsx";
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  }, [])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setUsername('')
      setPassword('')

      setNotification({
        message: 'wrong credentials',
        isError: true,
      })

      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  const createBlog = async (newBlog) => {
    const data = await blogService.create(newBlog)
    setBlogs(blogs.concat(data))
    setNotification({
      message: `a new blog ${data.title} by ${data.author} added`,
      isError: false,
    })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLikes = async (blog) => {
    try {
      const newBlog = { ...blog, likes: blog.likes + 1 }
      const returnedBlog = await blogService.updateBlog(newBlog)
      setBlogs(blogs.map(b => b.id === returnedBlog.id ? returnedBlog : b))
    } catch (err) {
      console.log('error:', err.message)
    }
  }

  if (!user) {
    return (
      <div>
        <h2>login to application</h2>
        <Notification notification={notification} />
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input 
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <div>{user.name} logged in <button onClick={handleLogout}>logout</button> </div>
      <br />
      <Togglable buttonLabel="create new blog">
        <BlogForm createBlog={createBlog} />
      </Togglable>
      <div>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            onLike={handleLikes}
          />)}
      </div>
    </div>
  )
}

export default App