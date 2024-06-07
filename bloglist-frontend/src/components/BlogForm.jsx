import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    createBlog(blogObject)
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')

  }

  return(
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          value={newTitle}
          onChange={event => setNewTitle(event.target.value)}
          placeholder='title'
        />
      </div>
      <div>
        author:
        <input
          value={newAuthor}
          onChange={event => setNewAuthor(event.target.value)}
          placeholder='author'
        />
      </div>
      <div>
        url:
        <input
          value={newUrl}
          onChange={event => setNewUrl(event.target.value)}
          placeholder='url'
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}
BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
