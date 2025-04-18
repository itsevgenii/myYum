import React from "react";
import { useUser } from "../context/UserContext"; // Adjust the path as necessary
import styles from "./Header.module.css"; // Adjust the path as necessary
import { Link } from "react-router-dom";
import frame from "../assets/frame.svg"; // replace with your myYum logo

const Header = () => {
  const { state } = useUser();
  const username = state.username;
  console.log("the username is: ", username);
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <img src={frame} alt="myYum" className={styles.logo} />
        <span className={styles.brand}>myYum</span>
      </div>

      <nav className={styles.nav}>
        <Link to="/meals/new">add meal</Link>
        <Link to="/meals">List all meals</Link>
      </nav>

      <div className={styles.right}>
        <Link to="/login" className={styles.logout}>
          logout
        </Link>
        <span className={styles.avatarName}>{username}</span>
        <div className={styles.avatar}></div>
      </div>
    </header>
  );
};

export default Header;
