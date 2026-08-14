import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState('all genres')

  // Skip queries if the view isn't active
  const { loading, data } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre === 'all genres' ? null : selectedGenre },
    skip: !props.show,
  })

  const allBooksResult = useQuery(ALL_BOOKS, {
    variables: { genre: null },
    skip: !props.show,
  })

  // 1. Check visibility BEFORE loading checks!
  if (!props.show) {
    return null
  }

  // 2. Handle loading state only when this page is visible
  if (loading || allBooksResult.loading) {
    return <div>loading...</div>
  }

  const books = data ? data.allBooks : []
  const allBooks = allBooksResult.data ? allBooksResult.data.allBooks : []

  const genres = Array.from(
    new Set(allBooks.flatMap((book) => book.genres || []))
  )

  return (
    <div>
      <h2>books</h2>

      {selectedGenre !== 'all genres' && (
        <p>
          in genre <strong>{selectedGenre}</strong>
        </p>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{typeof a.author === 'object' ? a.author.name : a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '10px' }}>
        {genres.map((g) => (
          <button key={g} onClick={() => setSelectedGenre(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => setSelectedGenre('all genres')}>
          all genres
        </button>
      </div>
    </div>
  )
}

export default Books