import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState('all genres')
  const result = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data ? result.data.allBooks : []

 
  const genres = Array.from(
    new Set(books.flatMap((book) => book.genres))
  )

  const booksToShow =
    selectedGenre === 'all genres'
      ? books
      : books.filter((b) => b.genres.includes(selectedGenre))

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
          {booksToShow.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name || a.author}</td>
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