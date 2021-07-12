import './App.css';

import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, split, useQuery, gql } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { setContext } from '@apollo/client/link/context'
import Test from './components/Test'

 //https://www.apollographql.com/docs/react/networking/authentication/ 
 const httpLink = createHttpLink({
    uri:  process.env.REACT_APP_GRAPHQL_ENDPOINT,
  });
  const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_WEB_SOCKET_ENDPOINT,
    options: {
      reconnect: true
    }
  });
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );
  const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            //authtoken: user ? user.token : ""
        }
    }
  })
  const client = new ApolloClient({
    link: authLink.concat(splitLink),
    cache: new InMemoryCache()
  });
const App = () => {
    return (
        <ApolloProvider client={client}>
            <Test />
        </ApolloProvider>
    )
}

export default App;
