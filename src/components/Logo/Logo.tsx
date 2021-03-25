import React from "react";
import * as styles from "./Logo.module.scss";
const Logo: React.FC = () => {
  return (
    <div className={styles.container}>
      <img className={styles.image} src="/img/logo.svg" alt="logo" />
      <div className={styles.title}>
        <div>Anime</div>
        <div>Character</div>
        <div>Quiz</div>
      </div>
    </div>
  );
};

export default Logo;
