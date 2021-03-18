import React, { useEffect } from "react";
import getTopAnimes from "../requests/getTopAnimes";

const Home: React.FC = () => {
  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const response = await fetch("https://graphql.anilist.co/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: getTopAnimes,
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
