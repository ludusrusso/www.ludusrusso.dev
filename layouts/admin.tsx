import { AuthProvider, useAuth } from "admin/auth/auth.provider";
import { Footer } from "admin/components/footer";
import { Nav } from "admin/components/nav";
import { FC, useEffect } from "react";
import Router from "next/router";

export const AdminLayout: FC = ({ children }) => {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser === null) {
      Router.push("/admin/auth/login");
    }
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
};
