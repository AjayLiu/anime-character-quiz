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

  const [displayedChoices, setDisplayedChoices] = useState<Array<AnimeItem>>();
  const [correctChoiceIndex, setCorrectChoiceIndex] = useState<number>();

  const [doneRandomizing, setDoneRandomizing] = useState(false);
  const shuffleRandList = () => {
    //make an array filled from 0 to pagesToGet * 50
    let tempArr = Array.from(Array(animeList.length).keys());
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

      const randomAnimeIDs = randomAnimes.map((v) => v.id);

      //if duplicate
      //check for duplicates among wrong choices
      const uniqueAnimes = new Set(randomAnimeIDs);
      if (
        randomAnimeIDs.includes(correctAnime.id) ||
        uniqueAnimes.size != randomAnimes.length
      ) {
        console.log("DUPE");
        randomAnimes = [];
        randomIndexes = [];
      } else {
        //check if our target character is in any of the choices (prevent ambiguity)
        const targetCharacter = correctAnime.characters[characterIndex];
        let foundAmbiguous = false;
        randomAnimes.forEach((val) => {
          val.characters.forEach((thisCharacter) => {
            if (thisCharacter.id == targetCharacter.id) {
              console.log("AMBIGUOUS CHARACTERS");
              foundAmbiguous = true;
            }
          });
        });
        if (!foundAmbiguous) break;
      }
    }

    //insert the correct answer
    const insertSpot = Math.floor(Math.random() * 4);
    randomAnimes.splice(insertSpot, 0, correctAnime);
    console.log(randomAnimes);

    setDisplayedChoices(randomAnimes);
    setCorrectChoiceIndex(insertSpot);
  };

  const fetchResults = useGetTopAnimes(PAGES_TO_GET);
  const animeList = fetchResults.results;
  const doneFetching = fetchResults.isDone;

  useEffect(() => {
    //done getting all animes
    if (doneFetching) {
      shuffleRandList();
    }
  }, [doneFetching]);

  useEffect(() => {
    if (randList) {
      setDoneRandomizing(true);
    }
  }, [randList]);

  useEffect(() => {
    if (doneRandomizing) {
      randomizeChoices();
    }
  }, [doneRandomizing, playerIndex]);

  const nextCharacter = () => {
    setPlayerIndex(playerIndex + 1);
    setCharacterIndex(Math.floor(Math.random() * 5));
  };

  return (
    <div>
      {!doneRandomizing ? (
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
