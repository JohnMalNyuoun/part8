import { gql } from '@apollo/client'

// --- QUERIES ---

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
      author {
        name
        born
        id
      }
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
      author {
        name
        born
        id
      }
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


export const ADD_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      author {
        name
        born
        id
      }
      published
      genres
      id
    }
  }
`

export const EDIT_BIRTH_YEAR = gql`
  mutation updateAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      id
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

