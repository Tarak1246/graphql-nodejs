const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post]
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User
  }

  type Query {
    users: [User]
    user(id: ID!): User
    posts: [Post]
    post(id: ID!): Post
  }

  type AuthPayload {
    token: String!
    refreshToken: String!
    user: User!
}

  input UserInput {
    name: String!
    email: String!
    password: String!
  }

  input PostInput {
    title: String!
    content: String!
    authorId: ID!
  }

  input LoginInput {
    email: String!
    password: String!
}

  type Mutation {
    addUser(user: UserInput): User
    addPost(post: PostInput): Post
  }

extend type Mutation {
  login(credentials: LoginInput!): AuthPayload
  refreshToken(token: String!): AuthPayload
}

`;
