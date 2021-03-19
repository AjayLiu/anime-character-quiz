import { useEffect, useState } from "react";

interface Character {
  name: string;
  image: string;
}

export interface AnimeItem {
  id?: number;
  title: string;
  characters: Array<Character>;
}

const useGetTopAnimes = (pagesToFetch: number) => {
  const [resultList, setResultList] = useState<Array<AnimeItem>>([]);

  const queryAnimePage = (page: number) => {
    return `
    {
      Page(page:1, perPage:50){
        media (sort:POPULARITY_DESC, isAdult: false){      
          title {
            english
           	romaji            
          }
          id
          characters(sort:FAVOURITES_DESC, perPage: 5){
            nodes{
              name {
                full
              }
              image{
                medium
              }
            }
          }      
        }	
      }
  }`;
  };

  useEffect(() => {
    const fetchAnimePage = async (page: number) => {
      try {
        const response = await fetch("https://graphql.anilist.co/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: queryAnimePage(page),
          }),
        });
        const { data } = await response.json();
        const arrayOfAnimes = data.Page.media;
        arrayOfAnimes.forEach((element) => {
          const characterList: Array<Character> = element.characters.nodes.map(
            (elem) => {
              const character: Character = {
                name: elem.name.full,
                image: elem.image.medium,
              };
              return character;
            }
          );
          const anime: AnimeItem = {
            title: element.title.english || element.title.romaji,
            characters: characterList,
            id: element.id,
          };
          setResultList((oldArr) => [...oldArr, anime]);
        });
      } catch (error) {
        console.error(error);
      }
    };
    for (let i = 1; i <= pagesToFetch; i++) {
      // setResultList(fetchAnimePage(i));
      fetchAnimePage(i);
    }
  }, []);

  return resultList;
};
export default useGetTopAnimes;
