import { Head, Html, Main, NextScript } from "next/document";

export default function D() {
  return (
    <Html className="h-full bg-gray-50">
      <Head>
        <GAHeader />
      </Head>
      <body className="h-full">
        <Main />
        <NextScript />
        <IubendaCookieBanner />
      </body>
    </Html>
  );
}

const IubendaCookieBanner = () => {
  if (process.env.VERCEL_ENV !== "production") {
    return null;
  }
  const script = `<script type="text/javascript">
  var _iub = _iub || [];
  _iub.csConfiguration = {"lang":"it","siteId":676905,"whitelabel":false,"cookiePolicyId":7981809};
  </script>
  <script type="text/javascript" src="//cdn.iubenda.com/cs/iubenda_cs.js" charset="UTF-8" async></script>`;
  return <div dangerouslySetInnerHTML={{ __html: script }}></div>;
};

const GAHeader = () => {
  if (process.env.VERCEL_ENV !== "production") {
    return null;
  }
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
      page_path: window.location.pathname,
    });
  `,
        }}
      />
    </>
  );
};
