import React, { useEffect } from "react";

const Home: React.FC = () => {
  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const response = await fetch("https://graphql.anilist.co/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
          {
              Page(perPage:50){
              media (sort:POPULARITY_DESC, popularity_greater: 4000){      
                title {
                  romaji
                }
                characters(sort:FAVOURITES_DESC, perPage: 1){
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
          }`,
          }),
        });
        const { data } = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAnimes();
  }, []);
  return <div>hi</div>;
};

export default Home;
