import React from 'react';
import {useSiteMetadata} from '../hooks/use-site-metadata';

export const SEO = ({title, description, pathname, children}) => {
  const {
    title: defaultTitle,
    description: defaultDescription,
    siteUrl,
  } = useSiteMetadata();

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    url: `${siteUrl}${pathname || ``}`,
  };

  return (
    <>
      <title>{seo.title}</title>
      <meta property="og:title" content={seo.title} />
      <meta name="description" content={seo.description} />
      <meta property="og:description" content={seo.description} />
      {children}
    </>
  );
};
