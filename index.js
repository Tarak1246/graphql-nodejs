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
    const token = req.headers.authorization?.split('Bearer ')[1];
    const user = verifyToken(token);
    return { user };
  }
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
