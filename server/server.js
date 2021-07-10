const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');

const { typeDefs, resolvers } = require('./schemas/index');


const PORT = process.env.PORT || 4000;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    // context: AuthMiddleware
});
server.applyMiddleware({ app });
app.use(cors())

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb'}));

app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
})