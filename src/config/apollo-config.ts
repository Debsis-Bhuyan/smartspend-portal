import { ApolloClient, InMemoryCache, from, split, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import createUploadLink from 'apollo-upload-client/public/createUploadLink.js';

// Links for different backend routes
const coreHttpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_BACKEND_CORE_URL}/graphql`,
});

const clinicalHttpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_BACKEND_CLINICAL_URL}/graphql`,
});

const uploadLink = createUploadLink({
  uri: `${process.env.NEXT_PUBLIC_BACKEND_CLINICAL_URL}/graphql`,
});

// Auth link for token injection
const authLink = setContext(async (_, { headers, req }) => {
  let token;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('accessToken');
  } else if (req?.headers?.authorization) {
    token = req.headers.authorization.replace('Bearer ', '');
  }

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
      'x-requested-with': 'XMLHttpRequest',
      Accept: 'application/json',
    },
  };
});

// Error handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(`[GraphQL error]: ${message}`, { locations, path, extensions });
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Route requests based on `clientName` context
const routedLink = split(
  (operation) => operation.getContext().clientName === 'clinicalHttpLink',
  clinicalHttpLink,
  split(
    (operation) => operation.getContext().clientName === 'upload',
    uploadLink,
    coreHttpLink
  )
);

// Final Apollo Client instance
const createApolloClient = () =>
  new ApolloClient({
    link: from([errorLink, authLink, routedLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {},
        },
      },
    }),
    credentials: 'include',
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
        notifyOnNetworkStatusChange: true,
      },
      query: {
        errorPolicy: 'all',
      },
    },
  });

export default createApolloClient;
