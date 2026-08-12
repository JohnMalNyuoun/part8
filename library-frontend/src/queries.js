import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`


export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
      genres
      id
    }
  }
`

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