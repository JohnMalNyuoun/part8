import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ME } from '../queries'

const Recommend = ({ show }) => {
  // Skip execution when the view is hidden
  const userResult = useQuery(ME, {
    skip: !show,
  })
  const booksResult = useQuery(ALL_BOOKS, {
    skip: !show,
  })

  // 1. Guard visibility FIRST
  if (!show) {
    return null
  }

  // 2. Handle loading state only when active
  if (userResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  const user = userResult.data ? userResult.data.me : null
  const books = booksResult.data ? booksResult.data.allBooks : []

  const favoriteGenre = user ? user.favoriteGenre : null

  const recommendedBooks = favoriteGenre
    ? books.filter((b) => b.genres && b.genres.includes(favoriteGenre))
    : []

  return (
    <div>
      <h2>recommendations</h2>
      {favoriteGenre ? (
        <p>
          books in your favorite genre <strong>{favoriteGenre}</strong>
        </p>
      ) : (
        <p>no favorite genre set</p>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{typeof a.author === 'object' ? a.author.name : a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend