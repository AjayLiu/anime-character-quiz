import Game from "@components/Game/Game";
import Logo from "@components/Logo/Logo";
import Layout from "@components/Layout/Layout";

import React from "react";
import { Title } from "react-head";
import Footer from "@components/Footer/Footer";

const Home: React.FC = () => {
  return (
    <Layout>
      <Title>Anime Character Quiz</Title>

      <div style={{ minHeight: "90vh" }}>
        <Logo />
        <Game />
      </div>
      <Footer />
    </Layout>
  );
};

export default Home;
