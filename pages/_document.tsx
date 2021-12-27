// src/pages/_document.js

import Document, { Html, Head, Main, NextScript } from 'next/document';

export default function D() {
  return (
    <Html className="h-full bg-gray-50">
      <Head>
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />
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
      </Head>
      <body className="h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
