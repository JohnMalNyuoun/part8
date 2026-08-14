import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN } from '../queries'

const LoginForm = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const [login, result] = useMutation(LOGIN, {
  onError: (error) => {
    const backendMsg = error.graphQLErrors?.[0]?.message || error.message || 'wrong credentials'
    setErrorMessage(`login failed: ${backendMsg}`)
    setTimeout(() => setErrorMessage(null), 5000)
  },
})


  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      setPage('authors')
      setUsername('')
      setPassword('')
    }
  }, [result.data, setToken, setPage])

  if (!show) return null

  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <div>
      <h2>login</h2>
     {errorMessage && (
  <div role="alert" style={{ color: 'red' }}>
    {errorMessage}
  </div>
)}
      <form onSubmit={submit}>
        <div>
          <label htmlFor="username">username</label>{' '}
          <input
            id="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">password</label>{' '}
          <input
            id="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm