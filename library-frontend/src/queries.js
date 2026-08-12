import { gql } from '@apollo/client'

export const ALL_DATA = gql`
  query {
    bookCount
    authorCount
    allBooks {
      title
      published
      author
      genres
      id
    }
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`