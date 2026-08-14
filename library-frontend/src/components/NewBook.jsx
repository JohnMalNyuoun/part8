import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'

const NewBook = ({ show, setPage }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => {
      console.error('Error adding book:', error)
    },
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    let updatedGenres = [...genres]
    if (genre.trim() && !updatedGenres.includes(genre.trim())) {
      updatedGenres = updatedGenres.concat(genre.trim())
    }

    await createBook({
      variables: {
        title,
        author,
        published: parseInt(published, 10),
        genres: updatedGenres,
      },
    })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')

    // Redirect to books page if setPage prop is passed from App.jsx
    if (setPage) {
      setPage('books')
    }
  }

  const addGenre = () => {
    if (genre.trim()) {
      setGenres(genres.concat(genre.trim()))
      setGenre('')
    }
  }

  return (
    <div>
      <h2>add book</h2>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="title">title</label>{' '}
          <input
            id="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <label htmlFor="author">author</label>{' '}
          <input
            id="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <label htmlFor="published">published</label>{' '}
          <input
            id="published"
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <label htmlFor="genre">genre</label>{' '}
          <input
            id="genre"
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook