import Game from "@components/Game/Game";
import Logo from "@components/Logo/Logo";

import React from "react";
import { Title } from "react-head";

const Home: React.FC = () => {
  return (
    <>
      <Title>Anime Character Quiz</Title>

      <div>
        <Logo />
        <Game />
      </div>
    </>
  );
};

export default Home;
