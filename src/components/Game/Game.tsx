import React, { useEffect, useState } from "react";
import useGetTopAnimes, { AnimeItem } from "@hooks/useGetTopAnimes";
import shuffle from "shuffle-array";
const Game: React.FC = () => {
  const PAGES_TO_GET = 5;
  const [randList, setRandList] = useState<Array<number>>();
  const [playerIndex, setPlayerIndex] = useState(0);
  const [characterIndex, setCharacterIndex] = useState<number>(
    Math.floor(Math.random() * 5)
  );
  const [isLoading, setIsLoading] = useState(true);

  const [displayedChoices, setDisplayedChoices] = useState<Array<AnimeItem>>();
  const [correctChoiceIndex, setCorrectChoiceIndex] = useState<number>();

  const shuffleRandList = () => {
    //make an array filled from 0 to pagesToGet * 50
    let tempArr = Array.from(Array(PAGES_TO_GET * 50).keys());
    shuffle(tempArr);
    setRandList(tempArr);
  };

  const randomizeChoices = () => {
    let randomAnimes: Array<AnimeItem> = [];
    const max = PAGES_TO_GET * 50 - 3;

    const correctAnime = animeList[randList[playerIndex]];
    //keep randomizing to make sure the real answer isnt in the wrong choices
    let randomIndexes = [];
    while (true) {
      const randIndex = Math.floor(Math.random() * max);
      randomIndexes = randList.slice(randIndex, randIndex + 3);
      randomIndexes.forEach((val) => {
        randomAnimes.push(animeList[randList[val]]);
      });

      //if duplicate
      let foundDupe = false;
      randomAnimes.forEach((val) => {
        if (val.id == correctAnime.id) {
          console.error(randomAnimes);
          randomAnimes = [];
          foundDupe = true;
        }
      });
      if (!foundDupe) break;
    }

    //insert the correct answer
    const insertSpot = Math.floor(Math.random() * 4);
    randomAnimes.splice(insertSpot, 0, correctAnime);

    console.log(randomAnimes);
    setDisplayedChoices(randomAnimes);
    setCorrectChoiceIndex(insertSpot);
  };

  const animeList = useGetTopAnimes(PAGES_TO_GET);
  useEffect(() => {
    //done getting all animes
    if (animeList.length == PAGES_TO_GET * 50) {
      shuffleRandList();
      setIsLoading(false);
    }
  }, [animeList]);

  useEffect(() => {
    if (!isLoading) {
      randomizeChoices();
    }
  }, [isLoading, playerIndex]);

  const nextCharacter = () => {
    setPlayerIndex(playerIndex + 1);
    setCharacterIndex(Math.floor(Math.random() * 5));
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading the top {animeList.length} animes...</p>
      ) : (
        <>
          <img
            src={
              animeList[randList[playerIndex]].characters[characterIndex].image
            }
          ></img>
          <h2>This character is from...</h2>
          {displayedChoices &&
            displayedChoices.map((item, idx) => {
              return (
                <div key={idx}>
                  <div>{item.title}</div>
                  <div>{item.id}</div>
                </div>
              );
            })}
          {correctChoiceIndex}
        </>
      )}
      <button onClick={() => nextCharacter()}>Next</button>
    </div>
  );
};

export default Game;
