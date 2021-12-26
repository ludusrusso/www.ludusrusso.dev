import Head from 'next/head';
import { config } from '../utils/config';

interface SEOProps {
  description?: string;
  title?: string;
  image?: string;
}

export const SEO = ({ description, title, image }: SEOProps) => {
  const siteTitle = title ? `${title} | ${config.title}` : config.title;
  image = image || config.image;
  description = description || config.description;

  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:image" content={image} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={config.title} />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:creator" content={config.social.twitter} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
    </Head>
  );
};
