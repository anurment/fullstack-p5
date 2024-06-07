import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Error from './components/Error'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
//import Footer from './components/Footer'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/blogForm'

/*
TODO

*/

const App = () => {
  //const [loginVisible, setLoginVisible] = useState(false)
  //const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const [user, setUser] = useState(null)

  const noteFormRef = useRef()
  const loginFormRef = useRef()

  useEffect(() => {

    const getBlogs = async () =>  {
      const initialBlogs = await blogService.getAll()
      setBlogs( initialBlogs)}
    getBlogs()

  }, [])


  useEffect(() => {

    const loggedUserJson = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      setUser(user)
      blogService.setToken(user.token)
    }



    /*const getBlogs = async () =>  {
    const initialBlogs = await blogService.getAll()
    setBlogs( initialBlogs)}
    getBlogs() */

  }, [])



  const addBlog = async (blogObject) => {
    try{
      const returnedBlog = await blogService.create(blogObject)
      const userData = {
        id : user.id,
        name: user.name,
        username: user.username
      }
      const newBlog = { ...returnedBlog, user: userData }
      console.log(returnedBlog)
      console.log(blogs[4])
      noteFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(newBlog))
      setNotification('blog added')
      setTimeout(() => {
        setNotification(null)
      }, 5000)

    } catch (exeption) {
      setErrorMessage('something went wrong')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

    }

  }

  const updateBlogLikes = async (id) => {
    try{
      const blogToChange = blogs.find(b => b.id === id)
      const putRequestData = { ...blogToChange, user: blogToChange.user.id, likes: blogToChange.likes+1, }

      const returnedBlog = await blogService.update(id, putRequestData)
      const changedBlog = { ...returnedBlog, user: blogToChange.user }
      //console.log(returnedBlog)
      //console.log(blogs[4])
      setBlogs(blogs.map(b => b.id !== id ? b : changedBlog))



    } catch (exeption){
      console.log(exeption)
      setErrorMessage('something went wrong')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

    }
  }

  const handleBlogDelete = async (blog) => {
    try{

      const response = await blogService.remove(blog.id)
      const filteredBlogs = blogs.filter(b => b.id !== blog.id)
      setBlogs(filteredBlogs)
      setNotification(`Removed blog ${blog.title} by ${blog.author}`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)


    } catch (exception) {
      setErrorMessage(`something went wrong when trying to remove the blog ${blog.title} by ${blog.author} `)
      console.log(exception)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  const handleLogin = async ({ username, password }) => {

    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    console.log('logging out with', user.username)
    try {
      setUser(null)
      window.localStorage.removeItem('loggedBlogAppUser')


    } catch (exception) {
      setNotification('something went wrong')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const logoutForm = () => (
    <form onSubmit= {handleLogout}>
      <button type="submit">logout</button>
    </form>
  )

  return (
    <div>

      <h2>Blogs</h2>
      <Notification message={notification} />
      <Error message={errorMessage} />

      {!user &&
        <div>
          <Togglable buttonLabel = "log in" ref={loginFormRef}>
            <LoginForm
              handleLogin={handleLogin}
            />
          </Togglable>
        </div>
      }
      {user &&
        <div>
          {user.name} logged in {logoutForm()}
          <Togglable buttonLabel = "new blog" ref={noteFormRef}>
            <BlogForm
              createBlog={addBlog}
            />
          </Togglable>
          <div>
            {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
              <Blog key={blog.id} blog={blog} user={user} updateLikes={updateBlogLikes} deleteBlog={handleBlogDelete} />
            )}
          </div>
        </div>
      }
    </div>
  )
}

export default App
