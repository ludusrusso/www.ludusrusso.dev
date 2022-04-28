import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { authCli, Token } from "../services/auth.service";

interface AuthContext {
  currentUser?: Token | null;
  token?: string | null;
  signOut: () => void;
}

const AuthContext = createContext<AuthContext>({ signOut: () => {} });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Token | null | undefined>(undefined);
  const [token, setToken] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    authCli.refresh().then(() => {});
    const sub = authCli.currentUser$.subscribe((user) => {
      setUser(user.user);
      setToken(user.token);
    });
    return () => sub.unsubscribe();
  }, []);

  const signOut = useCallback(() => authCli.signOut(), []);

  return (
    <AuthContext.Provider value={{ currentUser: user, token, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
