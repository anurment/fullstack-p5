import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = (event) => {
    event.preventDefault()
    const credentials = {
      username: username,
      password: password
    }
    handleLogin(credentials)
    setUsername('')
    setPassword('')
  }


  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={login}>
        <div>
           username
          <input
            data-testid='username'
            value={username}
            onChange={event => setUsername(event.target.value)}
          />
        </div>
        <div>
           password
          <input
            data-testid='password'
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm
