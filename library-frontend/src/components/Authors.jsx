import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { ALL_AUTHORS, EDIT_BIRTH_YEAR } from '../queries'

const Authors = ({ show, token }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const { loading, data } = useQuery(ALL_AUTHORS, { skip: !show })
  const [changeBirthYear] = useMutation(EDIT_BIRTH_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  if (!show) return null
  if (loading) return <div>loading...</div>

  const authors = data ? data.allAuthors : []

  const submit = async (e) => {
    e.preventDefault()
    if (!name) return

    await changeBirthYear({
      variables: { name, setBornTo: parseInt(born, 10) },
    })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Show birthyear form ONLY when logged in */}
      {token && (
        <div>
          <h3>Set birthyear</h3>
          <form onSubmit={submit}>
            <div>
              name{' '}
              <select
                name="name"
                value={name}
                onChange={({ target }) => setName(target.value)}
              >
                <option value="">select author...</option>
                {authors.map((a) => (
                  <option key={a.name} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="born-input">born</label>{' '}
              <input
                id="born-input"
                type="number"
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Authors