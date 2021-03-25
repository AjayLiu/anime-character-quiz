import React from "react";
import * as styles from "./Layout.module.scss";
const Layout: React.FC = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default Layout;
