import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState('all genres')

  // Fetch books filtered by the selected genre on the server
  const { loading, data, refetch } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre === 'all genres' ? null : selectedGenre },
  })

  // We also fetch all books once to extract all unique genre buttons
  const allBooksResult = useQuery(ALL_BOOKS, {
    variables: { genre: null }
  })

  if (!props.show) {
    return null
  }

  if (loading || allBooksResult.loading) {
    return <div>loading...</div>
  }

  const books = data ? data.allBooks : []
  const allBooks = allBooksResult.data ? allBooksResult.data.allBooks : []

  // Get unique genres list from all books
  const genres = Array.from(
    new Set(allBooks.flatMap((book) => book.genres))
  )

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre)
    refetch({ genre: genre === 'all genres' ? null : genre })
  }

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
              <td>{a.author.name || a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Genre Filter Buttons */}
      <div style={{ marginTop: '10px' }}>
        {genres.map((g) => (
          <button key={g} onClick={() => handleGenreChange(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => handleGenreChange('all genres')}>
          all genres
        </button>
      </div>
    </div>
  )
}

export default Books