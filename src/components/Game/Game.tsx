import React, { useEffect, useState } from "react";
import useGetTopAnimes, { AnimeItem } from "@hooks/useGetTopAnimes";
import shuffle from "shuffle-array";
import { useTimer } from "react-timer-hook";
import * as styles from "./Game.module.scss";

const Game: React.FC = () => {
  const rng = (max: number) => {
    return Math.floor(Math.random() * max);
  };
  const PAGES_TO_GET = 5;
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

  const [charactersAlreadySeen, setCharactersAlreadySeen] = useState<number[]>(
    []
  );

  const randomizeChoices = () => {
    setWrongChoices(shuffle(shuffle.pick(animeList, { picks: 3 })));
    setCharacterIndex(rng(5));
    setWrongChoiceDone(false);
  };

  const stringSimilarity = require("string-similarity");
  useEffect(() => {
    // prevent repeating seen characters
    const answerIsDupe = () => {
      return charactersAlreadySeen.includes(correctCharacter.id);
    };
    const containsBannedCharacters = () => {
      return correctCharacter.id === 36309; // character id for Narrator
    };
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
        if (
          containsDupes(wrongChoices) ||
          answerIsDupe() ||
          containsBannedCharacters()
        ) {
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

          setCharactersAlreadySeen([
            ...charactersAlreadySeen,
            correctCharacter.id,
          ]);
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
      myTimer.resume();
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
    // @ts-ignore
    document.activeElement.blur();

    if (chosenIndex === correctChoiceIndex) {
      addTime(3);
      showCorrectIndicator();
      nextCharacter();
    } else {
      gameOver();
      setCorrectIndicator("INCORRECT, the answer was: " + correctAnime.title);
    }
  };

  const [numTimeouts, setNumTimeouts] = useState(0);
  const showCorrectIndicator = () => {
    setCorrectIndicator("CORRECT! + 3 seconds");
    setNumTimeouts(numTimeouts + 1);
    // hide after 2 seconds (but account for the case when the player gets multiple correct within 2 seconds)
    setTimeout(() => {
      // console.log(numTimeouts);
      if (numTimeouts === 1) {
        setCorrectIndicator("");
      }
      setNumTimeouts(numTimeouts - 1);
    }, 2000);
  };

  const gameOver = () => {
    setIsGameOver(true);
  };

  const timesUp = () => {
    gameOver();
  };

  const STARTING_TIME = 30; // in seconds

  const addTime = (secondsToAdd: number) => {
    myTimer.restart(
      new Date().getTime() + secondsRemaining * 1000 + secondsToAdd * 1000
    );
  };

  const myTimer = useTimer({
    expiryTimestamp: new Date().getTime() + 1000 * STARTING_TIME,
    onExpire: timesUp,
  });
  const secondsRemaining = myTimer.minutes * 60 + myTimer.seconds;

  const resetTimer = () => {
    myTimer.restart(new Date().getTime() + 1000 * STARTING_TIME);
  };

  useEffect(() => {
    myTimer.start();
    myTimer.pause();
  }, []);

  const [isGameOver, setIsGameOver] = useState(false);

  const resetGame = () => {
    setIsGameOver(false);
    resetTimer();
    setPlayerIndex(0);
    shuffleAnimeList();
    setCorrectIndicator("");
  };

  const isPlural = (num: number) => {
    return num !== 1;
  };

  return (
    <div className={styles.container}>
      {isGameOver ? (
        <div>
          <div className={styles.label}>Game Over!</div>
          <img
            className={styles.characterImage}
            src={correctCharacter.image}
          ></img>
          <div className={styles.revealAnswer}>
            This character is <strong>{correctCharacter.name}</strong> from{" "}
            <strong>{correctAnime.title}</strong>
          </div>
          <p>Your Score: {playerIndex}</p>
          <button className={styles.button} onClick={() => resetGame()}>
            Play Again
          </button>
        </div>
      ) : !correctCharacter ? (
        <>
          <strong>Please wait...</strong>
          <p>
            Loading the top {fetchingList.length} / {PAGES_TO_GET * 50}{" "}
            animes...
          </p>
        </>
      ) : (
        <>
          <img
            className={styles.characterImage}
            src={correctCharacter.image}
          ></img>
          <div className={styles.score}>Your Score: {playerIndex}</div>
          <div
            className={styles.timeRemaining}
            style={{ color: secondsRemaining < 10 && "red" }}
          >
            {myTimer.isRunning
              ? (myTimer.minutes > 0
                  ? myTimer.minutes +
                    (isPlural(myTimer.minutes) ? " minutes " : " minute ")
                  : "") +
                (myTimer.seconds +
                  (isPlural(myTimer.seconds) ? " seconds " : " second ") +
                  "remaining")
              : "Time's up"}
          </div>
          <div className={styles.label}>This character is from...</div>
          <div className={styles.buttonContainer}>
            {displayedChoices &&
              displayedChoices.map((item, idx) => {
                return (
                  <button
                    key={idx}
                    className={styles.button}
                    onClick={() => onChoose(idx)}
                  >
                    {item.title}
                  </button>
                );
              })}
          </div>
          <div className={styles.correctIndicator}>{correctIndicator}</div>
          {/* {correctChoiceIndex}
          {correctCharacter.name} */}
        </>
      )}
    </div>
  );
};

export default Game;
