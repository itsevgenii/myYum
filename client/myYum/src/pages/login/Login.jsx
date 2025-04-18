import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import styles from "./Login.module.css";
import frame from "../../assets/frame.svg"; // replace with your real logo if different
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { state, dispatch } = useUser();

  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // const [token, setToken] = useState(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // <-- prevent the default form submission behavior

    setIsClicked(true);

    try {
      const response = await fetch("http://localhost:3003/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      console.log("🔥 Full login response:", data);

      if (response.ok) {
        dispatch({ type: "SET_USER", payload: data.userId });
        dispatch({ type: "SET_USERNAME", payload: data.username });
        console.log("✅ userId:", data.userId); // should NOT be undefined
        console.log("✅ username:", data.username);

        navigate("/");
        //setToken(data.token);  Assuming the token is returned in the response
        // Optionally, you can store the token in localStorage or sessionStorage
        // localStorage.setItem("token", data.token);
        // Redirect to another page after successful login
        // console.log("User ID from login req:", data.userId);
        // console.log("Username from login req:", data.username);

        navigate("/"); // Replace with your desired route
      } else {
        // Handle login error
        console.error("Login failed:", data.error);
        setIsLoginSuccessful(false);
        setIsRegisterMode(true);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
    // navigate("/");
  };
  console.log("Login data:", loginData);

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log("Register data:", registerData);

    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:3003/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        // Handle successful registration
        console.log("Registration successful:", data);
        setIsLoginSuccessful(true);
        dispatch({ type: "SET_USER", payload: data.userId }); // Assuming the user ID is returned in the response
        dispatch({ type: "SET_USERNAME", payload: data.username });
        console.log("User ID from registration req:", data.userId);

        // Optionally, you can store the token in localStorage or sessionStorage
        // localStorage.setItem("token", data.token);
        // Redirect to another page after successful login
        navigate("/"); // Replace with your desired route
      } else {
        // Handle registration error
        console.error("Registration failed:", data.error);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };
  console.log("Register data:", registerData);

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

      <button
        className={styles.loginButton}
        onClick={() => {
          setIsClicked(!isClicked);
        }}
      >
        Log in
      </button>
      {isClicked && (
        <div className={styles.modalContainer}>
          <div className={styles.modalHeader}>
            <img src={frame} alt="myYum logo" className={styles.frame} />
            <h2 className={styles.modalTitle}>Log in</h2>
            <button
              className={styles.closeButton}
              onClick={() => setIsClicked(!isClicked)}
            >
              &times;
            </button>
          </div>
          {!isRegisterMode ? (
            <form className={styles.modal} onSubmit={handleLogin}>
              <div className={styles.sectionInfo}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className={styles.input}
                  required
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                />
              </div>
              <div className={styles.sectionInfo}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className={styles.input}
                  required
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
              </div>
              <div className={styles.buttonContainer}>
                <button type="submit" className={styles.submitButton}>
                  Log in
                </button>
              </div>
            </form>
          ) : (
            <form className={styles.modal} onSubmit={handleRegister}>
              <div className={styles.sectionInfo}>
                <label htmlFor="username" className={styles.label}>
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  className={styles.input}
                  required
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      username: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.sectionInfo}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className={styles.input}
                  required
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.sectionInfo}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className={styles.input}
                  required
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.sectionInfo}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className={styles.input}
                  required
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.sectionInfo}>
                <label htmlFor="terms" className={styles.label}>
                  Terms and Conditions
                </label>
                <input type="checkbox" className={styles.checkbox} required />
                <span className={styles.termsText}>
                  I agree to the terms and conditions
                </span>
              </div>
              <div className={styles.sectionInfo}>
                <label htmlFor="image" className={styles.label}>
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className={styles.fileInput}
                />
              </div>
              <div className={styles.buttonContainer}>
                <p className={styles.errorMessage}>
                  Woops! Email or password seems off.
                </p>
                <button type="submit" className={styles.submitButton}>
                  Register
                </button>
              </div>
              <p className={styles.switchText}>
                Already have an account?
                <button
                  type="button"
                  className={styles.switchButton}
                  onClick={() => setIsRegisterMode(false)}
                >
                  Back to Login
                </button>
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
