import styles from "./Login.module.css";
import frame from "../../assets/frame.svg"; // replace with your real logo if different
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // fake login logic
    navigate("/");
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.logoWrapper}>
        <img src={frame} alt="myYum logo" className={styles.frame} />
        <p className={styles.frameParagraph}>myYum</p>
      </div>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&display=swap"
        rel="stylesheet"
      />

      <h1 className={styles.welcome}>Welcome to</h1>
      <h2 className={styles.brand}>myYum</h2>

      <p className={styles.description}>
        Log in to view your weekly meal plan <br />
        and add delicious recipes.
      </p>

      <button className={styles.loginButton} onClick={handleLogin}>
        Log in
      </button>
    </div>
  );
}
