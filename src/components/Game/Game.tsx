import React, { useEffect, useState } from "react";
import useGetTopAnimes, { AnimeItem } from "@hooks/useGetTopAnimes";
import shuffle from "shuffle-array";
const Game: React.FC = () => {
  const rng = (max: number) => {
    return Math.floor(Math.random() * max);
  };
  const PAGES_TO_GET = 4;
  const [playerIndex, setPlayerIndex] = useState(0);
  const [animeList, setAnimeList] = useState<AnimeItem[]>();
  const correctAnime = animeList && animeList[playerIndex];
  const [correctChoiceIndex, setCorrectChoiceIndex] = useState<number>();
  const [characterIndex, setCharacterIndex] = useState<number>(() => rng(5));
  const correctCharacter =
    correctAnime && correctAnime.characters[characterIndex];

  const [displayedChoices, setDisplayedChoices] = useState<AnimeItem[]>();
  const [wrongChoices, setWrongChoices] = useState<AnimeItem[]>();
  const [wrongChoiceDone, setWrongChoiceDone] = useState(false);

  const randomizeChoices = () => {
    setWrongChoices(shuffle(shuffle.pick(animeList, { picks: 3 })));
    setCharacterIndex(rng(5));
    setWrongChoiceDone(false);
  };

  const stringSimilarity = require("string-similarity");
  useEffect(() => {
    // if the anime name is too similar to the real answer, probably a sequel - mark it as a duplicate to prevent confusion
    // there should be no animes that contain the correct character (prevent ambiguity among answers)
    const containsDupes = (animes: AnimeItem[]) => {
      let foundDupe = false;
      animes.forEach((anime) => {
        if (anime.id === correctAnime.id) foundDupe = true;

        if (
          stringSimilarity.compareTwoStrings(anime.title, correctAnime.title) >=
          0.5
        )
          foundDupe = true;

        // console.log(anime.title + ", " + correctAnime.title);

        anime.characters.forEach((character) => {
          if (character.id === correctCharacter.id) {
            foundDupe = true;
          }
        });
      });
      return foundDupe;
    };
    if (wrongChoices) {
      if (!wrongChoiceDone) {
        if (containsDupes(wrongChoices)) {
          randomizeChoices();
          console.warn("dupe problem");
        } else {
          // insert the correct answer from 0 to 3
          const correctIndex = rng(4);
          const choicesWithAnswerMixedIn = wrongChoices;
          choicesWithAnswerMixedIn.splice(correctIndex, 0, correctAnime);
          setCorrectChoiceIndex(correctIndex);
          setWrongChoiceDone(true);
          setDisplayedChoices(wrongChoices);
        }
      }
    }
  }, [wrongChoices]);

  const fetchResults = useGetTopAnimes(PAGES_TO_GET);
  const fetchingList = fetchResults.results;
  const doneFetching = fetchResults.isDone;
  const [doneShuffling, setDoneShuffling] = useState(false);

  const shuffleAnimeList = async () => {
    setAnimeList(shuffle(fetchingList, { copy: true }));
  };

  // every time animeList updates, if it is different from what is being fetched, we know that it is done shuffling
  useEffect(() => {
    if (animeList) {
      animeList.forEach((val, idx) => {
        if (fetchingList[idx].id !== val.id) {
          setDoneShuffling(true);
          randomizeChoices();
        }
      });
    }
  }, [animeList]);

  useEffect(() => {
    // done getting all animes
    if (doneFetching) {
      shuffleAnimeList();
    }
  }, [doneFetching]);

  const nextCharacter = () => {
    setPlayerIndex(playerIndex + 1);
  };
  useEffect(() => {
    if (doneShuffling) randomizeChoices();
  }, [playerIndex]);

  const [correctIndicator, setCorrectIndicator] = useState<string>();
  const onChoose = (chosenIndex: number) => {
    if (chosenIndex === correctChoiceIndex) {
      setCorrectIndicator("CORRECT");
    } else {
      setCorrectIndicator("INCORRECT, the answer was: " + correctAnime.title);
    }
    nextCharacter();
  };

  return (
    <div>
      {!correctCharacter ? (
        <p>Loading the top {fetchingList.length} animes...</p>
      ) : (
        <>
          <img src={correctCharacter.image}></img>
          <h2>This character is from...</h2>
          {displayedChoices &&
            displayedChoices.map((item, idx) => {
              return (
                <div key={idx}>
                  <button onClick={() => onChoose(idx)}>{item.title}</button>
                </div>
              );
            })}
          {correctIndicator}
          <br></br>
          {/* {correctChoiceIndex}
          {correctCharacter.name} */}
        </>
      )}
      <p>{playerIndex}</p>
    </div>
  );
};

export default Game;
