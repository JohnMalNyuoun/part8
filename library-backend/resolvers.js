const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const SECRET = process.env.SECRET || 'secret'

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.genre) {
        return Book.find({}).populate('author')
      }
      return Book.find({ genres: { $in: [args.genre] } }).populate('author')
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      const books = await Book.find({})
      return authors.map((a) => {
        const count = books.filter(
          (b) => b.author && b.author.toString() === a._id.toString()
        ).length
        return {
          name: a.name,
          born: a.born,
          id: a._id,
          bookCount: count,
        }
      })
    },
    me: (root, args, context) => context.currentUser || null,
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.author, error },
          })
        }
      }

      const book = new Book({ ...args, author: author._id })

      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.title, error },
        })
      }

      return book.populate('author')
    },

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) return null

      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Editing author failed', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.name, error },
        })
      }

      return author
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })

      try {
        return await user.save()
      } catch (error) {
        throw new GraphQLError('Creating the user failed', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.username, error },
        })
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, SECRET) }
    },

    _resetDatabase: async () => {
      await Book.deleteMany({})
      await Author.deleteMany({})
      await User.deleteMany({})
      return true
    },
  },
}

module.exports = resolvers