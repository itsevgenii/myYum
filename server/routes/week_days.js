import express from "express";
const router = express.Router();

import {
  getMealsInfoByWeekDayAndUserId,
  // getMealsByWeekDayAndUserId,
  getAllMealsByUserId,
  deleteMeal,
} from "../models/week_days.js";

router.get("/", async (req, res) => {
  try {
    // const weekDays = await getWeekDays();
    const meals = await getAllMealsByUserId();
    // Combine week days with meals
    // res.json({ weekDays, meals });
    res.json(meals);
  } catch (error) {
    console.error("Error fetching week days:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:mealId", async (req, res) => {
  const { mealId } = req.params;

  try {
    const result = await deleteMeal(mealId);
    if (result) {
      res.status(200).json({ message: "Meal deleted successfully" });
    } else {
      res.status(404).json({ error: "Meal not found" });
    }
  } catch (error) {
    console.error("Error deleting meal:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

// Think of it like:

// Params are part of the road.
// Queries are stuff you're carrying in your backpack.

// router.get("/:weekDayId", async (req, res) => {
//   const { weekDayId } = req.params;
//   const { userId } = req.query; // Extract userId from query parameters

//   const mealsByDayUser = await getMealsByWeekDayAndUserId(weekDayId, userId);
//   res.json({ meals: mealsByDayUser.rows });
// });

router.get("/:weekDayId", async (req, res) => {
  const { weekDayId } = req.params;
  const { userId } = req.query; // Extract userId from query parameters

  const mealsInfoByDayUser = await getMealsInfoByWeekDayAndUserId(
    weekDayId,
    userId
  );
  res.json({ meals: mealsInfoByDayUser.rows });
});
