import { useState } from 'react'

const Blog = ({ blog, user, updateLikes, deleteBlog }) => {

  const [fullInfo, setFullInfo] = useState(false)

  const showWhenFullInfo = { display: fullInfo ? '' : 'none' }
  const buttonLabel = fullInfo ? 'hide' : 'view'

  const toggleFullInfo = () => {
    setFullInfo(!fullInfo)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const addALike = (event) => {
    event.preventDefault()


    updateLikes(blog.id)

  }

  const removeBlog = (event) => {
    event.preventDefault()
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog)
    } else {
      return
    }
  }




  return(
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleFullInfo}>{buttonLabel}</button>
      </div><br />
      <div style={showWhenFullInfo}>
        {blog.url}<br />
        {blog.likes}<button onClick={addALike}>like</button><br />
        {blog.user.name}<br />
        {(user.username === blog.user.username) &&
      <button onClick={removeBlog}>remove</button>
        }
      </div>
    </div>
  )
}

export default Blog
