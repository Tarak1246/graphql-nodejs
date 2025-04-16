require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const typeDefs = require('./typeDefs/schema');
const resolvers = require('./resolvers');
const { verifyToken } = require('./utils/jwt');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');
      if (!token) return { user: null };

      const user = verifyToken(token);
      return { user };
    } catch (err) {
      console.warn('Token verification failed:', err.message);
      return { user: null }; // still allow public operations
    }
  },
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    return server.listen({ port: process.env.PORT || 4000 });
  })
  .then((res) => {
    console.log(`🚀 Server running at ${res.url}`);
  })
  .catch(err => console.error('DB connection error:', err));
