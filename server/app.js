import express from "express";
import cors from "cors";
import morgan from "morgan";

import dotenv from "dotenv";
dotenv.config();

import db from "./db/db.js";

import week_daysRouter from "./routes/week_days.js";
import authRouter from "./routes/auth.js";

// import usersRouter from "./routes/users.js";
// import ratingsRouter from "./routes/rating.js";
// import eventsRouter from "./routes/events.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // optional if using cookies/auth headers
  })
);
app.use(morgan("dev"));

app.use(express.json());

app.use((req, res, next) => {
  console.log("🔍 Request URL:", req.originalUrl);
  next();
});

// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

// mdbConnect();

app.use("/", authRouter);
app.use("/", week_daysRouter);

// app.use("/ratings", ratingsRouter);

// app.use("/events", eventsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

export default app;
