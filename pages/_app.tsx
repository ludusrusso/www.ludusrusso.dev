import { withTRPC } from "@trpc/next";
import { AuthProvider } from "admin/auth/auth.provider";
import { authCli } from "admin/services/auth.service";
import { AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AppRouter } from "trpc/server";
import { SEO } from "../components/seo";
import "../styles/globals.css";
import * as ga from "../utils/ga";

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange =
      process.env.NODE_ENV === "production"
        ? (url: string) => {
            ga.pageview(url);
          }
        : (url: string) => {};
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <AuthProvider>
      <Head>
        <meta
          name="description"
          content="Ludusrusso è il sito di Ludovico Russo"
        />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/icon/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/icon/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/icon/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/icon/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/icon/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/icon/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/icon/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icon/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icon/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icon/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/icon/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icon/favicon-16x16.png"
        />
        <link rel="manifest" href="/icon/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta
          name="msapplication-TileImage"
          content="/icon/ms-icon-144x144.png"
        />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <SEO />
      <Component {...pageProps} />
    </AuthProvider>
  );
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    // const url = process.env.VERCEL_URL
    //   ? `https://${process.env.VERCEL_URL}/api/trpc`
    //   : "http://localhost:3000/api/trpc";

    return {
      url: "/api/trpc",
      headers: async () => {
        const { token } = authCli.currentUser;
        return {
          authorization: token ? `Bearer ${token}` : "",
        };
      },
    };
  },
  ssr: false,
})(MyApp);
