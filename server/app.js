import express from "express";
import cors from "cors";
import morgan from "morgan";

import dotenv from "dotenv";
dotenv.config();

import db from "./db/db.js";

import week_daysRouter from "./routes/week_days.js";

// import usersRouter from "./routes/users.js";
// import ratingsRouter from "./routes/rating.js";
// import eventsRouter from "./routes/events.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));

app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

// mdbConnect();

app.use("/", week_daysRouter);

// app.use("/ratings", ratingsRouter);

// app.use("/events", eventsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

export default app;
