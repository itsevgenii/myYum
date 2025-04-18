import db from "../db/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function registerUser(username, email, password) {
  try {
    // Ensure password is a string and not undefined
    if (!password || typeof password !== "string") {
      throw new Error("Invalid password");
    }

    // Hash the password with bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database with hashed password
    const result = await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING * ",
      [username, email, hashedPassword]
    );

    // returning * means that the row that was inserted will be returned. this means that the id_user will be returned with a purpose to be used in the future
    // returned information will be the same as the one that was inserted (username, email, password_hash)

    return result.rows[0];
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error("User registration failed");
  }
}

export async function loginUser(email, password) {
  try {
    // Query the database to find the user by email
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    console.log("Query result:", result.rows[0]);
    // If the user is not found, throw an error
    if (result.rows.length === 0) {
      throw new Error("Invalid email or password");
    }

    const user = result.rows[0]; // The found user

    // Compare the entered password with the stored hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    console.log(
      "Comparing password:",
      password,
      "with hash:",
      user.password_hash
    );
    // If the passwords do not match, throw an error
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // If the password matches, you can proceed with generating a token (JWT) or session
    console.log("Login successful for user:", user.username);

    // Return the user data or a session token (JWT token) if required
    console.log("Returning this user from loginUser:", user);
    return user; // Or generate a JWT token here if you're using tokens for authentication
  } catch (error) {
    console.error("Error logging in user:", error);
    throw new Error("User login failed");
  }
}

// CREATE TABLE users (
//     id_user SERIAL PRIMARY KEY,
//     username VARCHAR(50) UNIQUE NOT NULL,
//     email VARCHAR(100) UNIQUE NOT NULL,
//     password_hash TEXT NOT NULL,
//     pic TEXT,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
