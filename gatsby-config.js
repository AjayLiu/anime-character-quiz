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
    `gatsby-plugin-sass`,
    `gatsby-plugin-tsconfig-paths`,
    `gatsby-plugin-react-head`,
  ],
};
