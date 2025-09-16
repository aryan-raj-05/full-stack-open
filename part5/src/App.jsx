import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser')
    if (loggedInUser) {
      const storedUser = JSON.parse(loggedInUser)
      setUser(storedUser)
      blogService.setToken(storedUser.token)
    }
  }, [])

  const notify = (message, isError) => {
    setNotification({ message, isError })
    setTimeout(() => { setNotification(null) }, 5000)
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch {
      notify('wrong credentials', true)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  const createBlog = async (newBlog) => {
    try {
      blogRef.current.toggleVisibility()
      const data = await blogService.create(newBlog)
      setBlogs(blogs.concat(data))
      notify(`a new blog ${data.title} by ${data.author} added`, false)
    } catch (err) {
      notify('failed to create blog', true)
      console.log('error:', err.message)
    }
  }

  const handleLikes = async (blog) => {
    const updated = { ...blog, likes: blog.likes + 1 }
    setBlogs(blogs.map(b => b.id === blog.id ? updated : b))
    try {
      const returnedBlog = await blogService.updateBlog(updated)
      setBlogs(blogs.map(b => b.id === returnedBlog.id ? returnedBlog : b))
    } catch (err) {
      notify('failed to update likes', true)
      console.log('error:', err.message)
    }
  }

  if (!user) {
    return (
      <div>
        <h2>login to application</h2>
        <Notification notification={notification} />
        <LoginForm onLogin={handleLogin}/>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <div>{user.name} logged in <button onClick={handleLogout}>logout</button> </div>
      <br />
      <Togglable buttonLabel="create new blog" ref={blogRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      <div>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              onLike={handleLikes}
            />)
        }
      </div>
    </div>
  )
}

export default App