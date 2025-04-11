import express from "express";
const router = express.Router();

import { getWeekDays, getMeals } from "../models/week_days.js";

router.get("/", async (req, res) => {
  try {
    const weekDays = await getWeekDays();
    const meals = await getMeals();
    // Combine week days with meals
    res.json({ weekDays, meals });
  } catch (error) {
    console.error("Error fetching week days:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
