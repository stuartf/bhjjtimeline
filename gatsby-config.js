/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  plugins: [
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`,
      },
    },
  ],
  pathPrefix: '/bhjjtimeline',
  siteMetadata: {
    title: "Buckhead Jiu Jitsu Timeline",
    description: "A history of belts awarded at Buckhead Jiu Jistu",
    siteUrl: "https://stuartf.github.io/bhjjtimeline",
  }
};
