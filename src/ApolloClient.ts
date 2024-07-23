import { ApolloLink, concat, HttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";

const httpLink = new HttpLink({ uri: "https://graphql.anilist.co" });

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  const token = process.env.AUTH_TOKEN;
  const cookie = process.env.COOKIE;

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
    headers: {
      cookie: cookie ? cookie : "",
      authorization: token ? `Bearer ${token}` : "",
    },
  });
});
