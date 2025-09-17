import { useState } from 'react'
import Button from './Button'

const Blog = ({ loggedInUser, blog, onLike, onDelete }) => {
  const [visible, setVisible] = useState(false)

  const buttonPrompt = visible ? 'hide' : 'view'

  const showIfBelongsToUser = {
    display: loggedInUser === blog.user.name ? '' : 'none',
    marginBottom: '4px',
    backgroundColor: 'blue',
    borderRadius: '5px',
    border: '2px none'
  }

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
          <Button onclick={() => onDelete(blog)} text='remove' style={showIfBelongsToUser}/>
        </div>
      </div>
    </div>
  )
}

export default Blog