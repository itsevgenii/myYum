import express from "express";
const router = express.Router();

import {
  getMealsInfoByWeekDayAndUserId,
  // getMealsByWeekDayAndUserId,
  getAllMealsByUserId,
  deleteMeal,
  addMealsByWeekDayAndUserId,
} from "../models/week_days.js";

router.get("/", async (req, res) => {
  const { userId } = req.query; // Extract userId from query parameters
  console.log("Query params:", req.query);

  try {
    // const weekDays = await getWeekDays();
    const meals = await getAllMealsByUserId(userId);
    // Combine week days with meals
    // res.json({ weekDays, meals });
    res.json({ meals: meals.rows }); // Send meals as JSON response
    //res always returns a json object
  } catch (error) {
    console.error("Error fetching week days:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:weekDayId", async (req, res) => {
  const { weekDayId } = req.params;
  const { userId } = req.query; // Extract userId from query parameters

  const mealsInfoByDayUser = await getMealsInfoByWeekDayAndUserId(
    weekDayId,
    userId
  );
  res.json({ meals: mealsInfoByDayUser.rows });
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

router.post("/:weekDayId", async (req, res) => {
  const { weekDayId } = req.params;
  const { userId, mealId, mealName, mealDescription, mealCategory } = req.body;

  try {
    const result = await addMealsByWeekDayAndUserId(
      weekDayId,
      userId,
      mealId,
      mealName,
      mealDescription,
      mealCategory
    );
    res.status(201).json({ message: "Meal added successfully", result });
  } catch (error) {
    console.error("Error adding meal:", error);
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
