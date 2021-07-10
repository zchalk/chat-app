const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Message {
        id: ID!
        user: String!
        content: String!
    }
    type Query {
        messages: [Message]
    }
    type Mutation {
        postMessage(user: String!, content: String!): ID!
    }`
    module.exports = typeDefs;