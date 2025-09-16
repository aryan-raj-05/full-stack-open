import { useState } from 'react'
import Button from './Button'

const Blog = ({ blog, onLike }) => {
  const [visible, setVisible] = useState(false)

  const buttonPrompt = visible ? 'hide' : 'view'
  const showWhenVisible = { display : visible ? '' : 'none' }

  const toggleView = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      <div>
        <div>
          {blog.title} {blog.author} <Button onclick={toggleView} text={buttonPrompt}/>
        </div>
        <div style={showWhenVisible}>
          <div>{blog.url}</div>
          <div>
            {blog.likes} <Button onclick={() => onLike(blog)} text="like"/>
          </div>
          <div>{blog.user.name}</div>
        </div>
      </div>
    </div>
  )
}

export default Blog