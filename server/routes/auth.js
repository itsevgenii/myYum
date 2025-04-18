import express from "express";

const router = express.Router();

import { registerUser, loginUser } from "../models/auth.js";

router.post("/user/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await registerUser(username, email, password);
    res.status(201).json({
      userId: user.id_user,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await loginUser(email, password);
    // res.status(200).json({ user, token });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    console.log("User being returned on login:", user);
    res.status(200).json({
      message: "Login successful",
      userId: user.id_user,
      username: user.username,
      email: user.email,
      // token: 'optional-token-if-used'
      //   token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(401).json({ error: "Invalid email or password" });
  }
});

export default router;
