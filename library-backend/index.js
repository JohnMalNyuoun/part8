const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const User = require('./models/user')
const schema = require('./schema')

const MONGODB_URI = process.env.MONGODB_URI
const SECRET = process.env.JWT_SECRET || process.env.SECRET || 'secret'

mongoose.set('strictQuery', false)
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.log('error connecting to MongoDB:', error.message))

const server = new ApolloServer({
  schema,
})

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 },
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      try {
        const decodedToken = jwt.verify(auth.substring(7), SECRET)
        const currentUser = await User.findById(decodedToken.id)
        return { currentUser }
      } catch (error) {
        console.error('JWT verification failed:', error.message)
        return { currentUser: null }
      }
    }
    return { currentUser: null }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})