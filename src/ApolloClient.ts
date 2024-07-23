import { ApolloLink, concat, HttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";

// const authMiddleware = new ApolloLink((operation, forward) => {
//   // add the authorization to the headers
//   operation.setContext(({ headers = {} }) => {
//     console.log(headers);

//     // return {
//     //   headers: {
//     //     ...headers,
//     //     authorization: localStorage.getItem("token") || null,
//     //   },
//     // };
//   });

//   return forward(operation);
// });

// const logLink = new ApolloLink((operation, forward) => {
//   console.info("request", operation.getContext());
//   return forward(operation).map((result) => {
//     console.info("response", operation.getContext());
//     return result;
//   });
// });

const httpLink = new HttpLink({ uri: "https://graphql.anilist.co" });

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  const token = process.env.AUTH_TOKEN;
  const cookie = process.env.COOKIE;

  return new ApolloClient({
    cache: new InMemoryCache(),
    // link: concat(logLink, httpLink),
    link: httpLink,
    headers: {
      cookie: cookie ? cookie : "",
      authorization: token ? `Bearer ${token}` : "",
    },
  });
});
