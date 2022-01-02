import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth.provider';

export const RequireAuth: FC = ({ children }) => {
  let { currentUser } = useAuth();
  let location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <>{children}</>;
};
