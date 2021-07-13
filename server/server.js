const express = require('express');
const  {
      ApolloServer
    } = require('apollo-server-express');
const cors = require('cors');
const { execute, subscribe } = require('graphql');
const db = require('./config/config');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { createServer } = require('http');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

const {typeDefs, resolvers } = require('./schemas/index');


const PORT = process.env.PORT || 4000;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: `ws://localhost:${PORT}/subscriptions`,
    context: { pubsub }
    // context: AuthMiddleware
});
server.applyMiddleware({ app });
app.use(cors())
// app.use('*', cors({ origin: `http://localhost:${PORT}` }));

// app.use('/graphql',  ApolloServer({
//   schema, context: { pubsub }
// }));

// app.use('/graphiql', graphiqlExpress({
//   endpointURL: '/graphql',
//   subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
// }));


app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb'}));


db.once('open', () => {
    const ws = createServer(app);
    ws.listen(PORT, () => {
      console.log(`Apollo Server is now running on http://localhost:${PORT}`, app, ws);
      // Set up the WebSocket for handling GraphQL subscriptions
      const subServer = new SubscriptionServer({
        execute,
        subscribe,
        typeDefs, 
        resolvers
      }, {
        server: ws,
        path: '/subscriptions',
      });
      console.log('HERE IS SUB SERVER:', subServer);
    });
    
})

module.export = pubsub;
































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

// app.use('/graphiql', graphiqlExpress({
//   endpointURL: '/graphql',
//   subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
// }));

// // Wrap the Express app
// const ws = createServer(app);
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