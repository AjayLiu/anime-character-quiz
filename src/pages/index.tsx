import Game from "@components/Game/Game";
import React from "react";

const Home: React.FC = () => {
  return (
    <div>
      <head>
        <title>Anime Character Quiz</title>
      </head>
      <img src="/img/logo.svg" alt="logo" width={100} />
      <Game />
    </div>
  );
};

export default Home;
