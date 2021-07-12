const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const { execute, subscribe } = require('graphql');
const db = require('./config/config');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { createServer } = require('http');

const { typeDefs, resolvers } = require('./schemas/index');


const PORT = process.env.PORT || 4000;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: `ws://localhost:${PORT}/subscriptions`
    // context: AuthMiddleware
});
server.applyMiddleware({ app });
app.use(cors())

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb'}));


db.once('open', () => {
    const myServer = app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
    }) 
    // const ws = createServer(myServer);
    // ws.listen(PORT, () => {
    // console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    // new SubscriptionServer({
    //     execute,
    //     subscribe,
    //     typeDefs,
    //     resolvers
    //   }, {
    //     server: ws,
    //     path: '/subscriptions',
    //  });
    // });
})
































// import express from 'express';
// import {
//   graphqlExpress,
//   graphiqlExpress,
// } from 'apollo-server-express';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import { execute, subscribe } from 'graphql';
// import { createServer } from 'http';
// import { SubscriptionServer } from 'subscriptions-transport-ws';

// import { schema } from './src/schema';

// const PORT = 3000;
// const app = express();

// app.use('*', cors({ origin: `http://localhost:${PORT}` }));

// app.use('/graphql', bodyParser.json(), graphqlExpress({
//   schema
// }));

// server.use('/graphiql', graphiqlExpress({
//   endpointURL: '/graphql',
//   subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
// }));

// // Wrap the Express server
// const ws = createServer(server);
// ws.listen(PORT, () => {
//   console.log(`Apollo Server is now running on http://localhost:${PORT}`);
//   // Set up the WebSocket for handling GraphQL subscriptions
//   new SubscriptionServer({
//     execute,
//     subscribe,
//     schema
//   }, {
//     server: ws,
//     path: '/subscriptions',
//   });
// });