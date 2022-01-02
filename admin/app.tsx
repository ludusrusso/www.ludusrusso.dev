import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { FC } from 'react';
import { BrowserRouter, Route, Routes, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/auth.provider';
import { LoginPage } from './auth/login';
import { RequireAuth } from './auth/require-auth';
import { Footer } from './components/footer';
import { Nav } from './components/nav';
import { ParticipantPage } from './participants/main';
import { setContext } from '@apollo/client/link/context';

export default function AdminApp() {
  return (
    <AuthProvider>
      <ApiProvider>
        <BrowserRouter basename="/admin">
          <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
            <Nav />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/*"
                element={
                  <RequireAuth>
                    <MainPage />
                  </RequireAuth>
                }
              />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </ApiProvider>
    </AuthProvider>
  );
}

const MainPage = () => {
  return (
    <>
      <Routes>
        <Route path="participants/*" element={<ParticipantPage />} />
        <Route index element={<Navigate to="participants" />} />
      </Routes>
    </>
  );
};

const ApiProvider: FC = ({ children }) => {
  const apolloCli = useApolloClient();
  return <ApolloProvider client={apolloCli}>{children}</ApolloProvider>;
};

const useApolloClient = () => {
  const { token } = useAuth();
  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};
