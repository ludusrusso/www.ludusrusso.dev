import { Footer } from "admin/components/footer";
import { Nav } from "admin/components/nav";
import Router from "next/router";
import { ReactNode, useEffect } from "react";

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const currentUser = null;

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
