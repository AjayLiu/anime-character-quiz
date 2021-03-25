import Game from "@components/Game/Game";
import Logo from "@components/Logo/Logo";
import Layout from "@components/Layout/Layout";

import React from "react";
import { Helmet } from "react-helmet";

import Footer from "@components/Footer/Footer";

const Home: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Anime Character Quiz</title>
        <link
          rel="canonical"
          href="https://anime-character-quiz.netlify.app/"
        />
        <meta
          name="Description"
          content="Can you tell which anime these characters are from just from a single image?"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Anime Character Quiz" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://anime-character-quiz.netlify.app/"
        />
        <meta
          property="og:image"
          content="https://anime-character-quiz.netlify.app/img/logo.png"
        />
        <meta
          property="og:description"
          content="Can you tell which anime these characters are from just from a single image?"
        />
      </Helmet>

      <div style={{ minHeight: "90vh" }}>
        <Logo />
        <Game />
      </div>
      <Footer />
    </Layout>
  );
};

export default Home;
