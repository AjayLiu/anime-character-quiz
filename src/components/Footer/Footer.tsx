import React from "react";
import * as styles from "./Footer.module.scss";

const Footer: React.FC = () => {
  const imgPath = "https://ajayliu.com/img";
  const projectRepoLink = "https://github.com/AjayLiu/anime-character-quiz";
  return (
    <>
      <footer className={styles.footer}>
        <p>
          © {new Date().getFullYear()}{" "}
          <a href="https://ajayliu.com">Ajay Liu</a>. All Rights Reserved •{" "}
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@ajayliu.com">
            contact@ajayliu.com
          </a>
        </p>
        <div id={styles.socialLinks}>
          <a href="https://ajayliu.com">
            <img src={imgPath + "/web_icon.svg"} alt="website logo" />
          </a>
          <a href="https://github.com/AjayLiu">
            <img src={imgPath + "/github.svg"} alt="github logo" />
          </a>
          <a href="https://www.linkedin.com/in/ajayliu/">
            <img src={imgPath + "/linkedin.svg"} alt="linkedin logo" />
          </a>
          <a href="https://www.youtube.com/channel/UClr6XCaguPeM0g7UL6Lvs3g">
            <img src={imgPath + "/youtube.svg"} alt="youtube logo" />
          </a>
        </div>
        <div className={styles.repo}>
          <a href={projectRepoLink} className={styles.repoAnchor}>
            <img src={imgPath + "/repo.svg"} />
            View this project on Github
          </a>
        </div>
      </footer>
    </>
  );
};

export default Footer;
