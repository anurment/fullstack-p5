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
    const loggedUserJson = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      setUser(user)
      blogService.setToken(user.token)
      
    }

    
  }, [])

  useEffect(() => {
    const getBlogs = async () =>  {
      const initialBlogs = await blogService.getAll()
      setBlogs( initialBlogs)}
      getBlogs()
      
  }, [])
  
  const addBlog = async (blogObject) => {
    try{
      const returnedBlog = await blogService.create(blogObject)
      noteFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(returnedBlog))
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

  const handleLogin = async ({username, password}) => {

    /*
    loginFormRef.current.toggleVisibility()
    loginService
      .login(username, password)
        .then(returnedUser => {
        
        setUser(returnedUser)
        window.localStorage.setItem(
          'loggedBlogAppUser', JSON.stringify(returnedUser))
        blogService.setToken(returnedUser.token)  
      })
      .catch(error => {
        setErrorMessage('wrong credentials')
        setTimeout(() => {
        setErrorMessage(null)
        }, 5000)  
      })
    }
    */
    
    //const username = credentials.username
    //const password = credentials.password
    
    //console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
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
      window.localStorage.removeItem('loggedBlogappUser')
      
      
    } catch (exception) {
      setNotification('something went wrong')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  /*
  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            handleLogin={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }
  */
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
          {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
          )}
        </div>
        </div>
      }
    </div>
  )
}

export default App
