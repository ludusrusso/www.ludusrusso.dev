import { createContext, FC, useCallback, useContext, useEffect, useState } from 'react';
import { auth, Token } from '../services/auth.service';

interface AuthContext {
  currentUser?: Token | null;
  token?: string | null;
  signOut: () => void;
}

const AuthContext = createContext<AuthContext>({ signOut: () => {} });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<Token | null | undefined>(undefined);
  const [token, setToken] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    auth.refresh().then(() => {});
    const sub = auth.currentUser$.subscribe((user) => {
      setUser(user.user);
      setToken(user.token);
    });
    return () => sub.unsubscribe();
  }, []);

  const signOut = useCallback(() => auth.signOut(), []);

  return <AuthContext.Provider value={{ currentUser: user, token, signOut }}>{children}</AuthContext.Provider>;
};
