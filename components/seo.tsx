import Head from 'next/head';
import { config } from '../utils/config';

interface SEOProps {
  description?: string;
  title?: string;
  image?: string;
  type?: 'website' | 'article';
  author?: string;
  date?: Date;
}

export const SEO = ({ description, title, image, type = 'website', author = 'ludusrusso', date }: SEOProps) => {
  const siteTitle = title ? `${title} | ${config.title}` : config.title;
  image = image || config.image;
  description = description || config.description;

  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="type" property="og:type" content={type} />
      <meta name="title" property="og:title" content={siteTitle} />
      <meta name="image" property="og:image" content={image} />
      <meta property="og:image:alt" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={config.title} />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:creator" content={config.social.twitter} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta name="author" content={author} />
      {date && <meta property="article:published_time" content={date.toISOString()} />}
    </Head>
  );
};
