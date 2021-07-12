const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Message {
    _id: ID!
    content: String!
    postUser: User
    # reveievingUser: User
  }
  type User {
      _id: ID!,
      username: String!,
      email: String!
  }
  type Query {
    allUsers: [User!]!
    allMessages: [Message!]!
    userMessages: [Message!]!
  }
  input messageInput {
    content: String!
  }
  type Mutation {
    postMessage(input: messageInput!): Message!
  }
  type Subscription {
    messageSent: Message!
  }
  schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}
`
    module.exports = typeDefs;