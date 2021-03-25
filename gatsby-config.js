module.exports = {
  siteMetadata: {
    title: `Anime Character Quiz`,
  },
  plugins: [
    {
      resolve: "gatsby-source-graphql",
      options: {
        // Arbitrary name for the remote schema Query type
        typeName: "Anilist",
        // Field under which the remote schema will be accessible. You'll use this in your Gatsby query
        fieldName: "anilist",
        // Url to query from
        url: "https://graphql.anilist.co/",
      },
    },
    // Add typescript stack into webpack
    `gatsby-plugin-typescript`,
    `gatsby-plugin-tsconfig-paths`,
    `gatsby-plugin-react-head`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingId: "UA-178410803-9", // Google Analytics / GA
        head: true,
      },
    },
  ],
};
