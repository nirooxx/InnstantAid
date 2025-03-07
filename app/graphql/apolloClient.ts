// apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';


const httpLink = new HttpLink({
  uri: 'https://www.3rpms.de/graphql',
  headers: {
    Authorization: 'api_4Zkbn2rADDt8W8VopL4qaR0IyvnL', 
  },
});
console.log(httpLink)
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
