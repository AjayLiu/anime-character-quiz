import React from "react";
import * as styles from "./About.module.scss";
const About: React.FC = () => {
  return (
    <div className={styles.container}>
      <p>
        This game was made by <a href="https://ajayliu.com">Ajay Liu</a>.{" "}
      </p>
      <p>The anime information is fetched from Anilist's GraphQL API.</p>
    </div>
  );
};

export default About;
