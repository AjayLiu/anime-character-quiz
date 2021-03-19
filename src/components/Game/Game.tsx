import React, { useEffect, useState } from "react";
import useGetTopAnimes, { AnimeItem } from "@hooks/useGetTopAnimes";
import shuffle from "shuffle-array";
const Game: React.FC = () => {
  const PAGES_TO_GET = 5;
  const [randList, setRandList] = useState<Array<number>>();
  const [animeIndex, setAnimeIndex] = useState(0);
  const [characterIndex, setCharacterIndex] = useState<number>(
    Math.floor(Math.random() * 5)
  );
  const [isLoading, setIsLoading] = useState(true);

  const [displayedChoices, setDisplayedChoices] = useState<Array<AnimeItem>>();
  const [correctChoiceIndex, setCorrectChoiceIndex] = useState<number>();

  const shuffleRandList = () => {
    //make an array filled from 0 to pagesToGet * 50
    let tempArr = Array.from(Array(PAGES_TO_GET * 50).keys());
    setRandList(shuffle(tempArr));
  };
  const randomizeChoices = () => {
    let randomIndexes = [];
    const max = PAGES_TO_GET * 50 - 3;

    //keep randomizing to make sure the real answer isnt in the wrong choices
    do {
      const randIndex = Math.floor(Math.random() * max);
      randomIndexes = randList.slice(randIndex, randIndex + 3);
    } while (randomIndexes.includes(randList[animeIndex]));

    const choices = randomIndexes.map((val) => {
      return animeList[val];
    });

    //insert the correct answer
    const correctAnswerIndex = Math.floor(Math.random() * 4);
    choices.splice(correctAnswerIndex, 0, animeList[randList[animeIndex]]);
    setDisplayedChoices(choices);
    setCorrectChoiceIndex(correctAnswerIndex);
  };
  const animeList = useGetTopAnimes(PAGES_TO_GET);
  useEffect(() => {
    if (animeList.length == PAGES_TO_GET * 50) {
      shuffleRandList();
      setIsLoading(false);
    }
  }, [animeList]);

  useEffect(() => {
    if (randList != undefined) {
      randomizeChoices();
    }
  }, [randList, animeIndex]);

  useEffect(() => {
    console.log(displayedChoices);
  }, [displayedChoices]);

  const nextCharacter = () => {
    setAnimeIndex(animeIndex + 1);
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
              animeList[randList[animeIndex]].characters[characterIndex].image
            }
          ></img>
          <h2>This character is from...</h2>
          {displayedChoices &&
            displayedChoices.map((item, idx) => {
              return <div key={idx}>{item.title}</div>;
            })}
          {correctChoiceIndex}
        </>
      )}
      <button onClick={() => nextCharacter()}>Next</button>
    </div>
  );
};

export default Game;
