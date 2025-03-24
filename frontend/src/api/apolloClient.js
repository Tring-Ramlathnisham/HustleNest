
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_BACKEND_URI,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token"); 
  console.log(token);
  // If using auth
  return {
    headers: {
      ...headers,
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
}
);

export default client;
