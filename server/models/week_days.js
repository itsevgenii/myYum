import db from "../db/db.js";

export async function getWeekDays() {
  // Fetch week days from the database
  try {
    const result = await db.query("SELECT * FROM week_days");
    return result.rows;
  } catch (error) {
    console.error("Error fetching week days:", error);
    return []; // fallback in case of error
  }
}

export async function getMeals() {
  // Fetch meals from the database
  try {
    const result = await db.query("SELECT * FROM meals");
    return result.rows;
  } catch (error) {
    console.error("Error fetching meals:", error);
    return []; // fallback in case of error
  }
}
