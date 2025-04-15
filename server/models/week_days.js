import db from "../db/db.js";

export async function getWeekDays() {
  // Fetch week days from the database
  try {
    const result = await db.query("SELECT * FROM week_days");
    return result.rows;
  } catch (error) {
    console.error("Error fetching week days:", error);
    return { rows: [] }; // fallback in case of error
  }
}

export async function getAllMealsByUserId(userId) {
  // Fetch meals from the database
  try {
    const result = await db.query(
      `SELECT 
        m.id_meal,
        m.name AS meal_name,
        m.description,
        m.category,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id_ingredient', i.id_ingredient,
              'name', i.name,
              'quantity', i.quantity,
              'unit', i.unit,
              'status', i.status
            )
          ) FILTER (WHERE i.id_ingredient IS NOT NULL),
          '[]'
        ) AS ingredients
      FROM meals m
      LEFT JOIN meal_ingredients mi ON m.id_meal = mi.id_meal
      LEFT JOIN ingredients i ON mi.id_ingredient = i.id_ingredient
      WHERE m.user_id = $1
      GROUP BY m.id_meal`,
      [userId]
    );
  } catch (error) {
    console.error("Error fetching meals:", error);
    return []; // fallback in case of error
  }
}

export async function deleteMeal(idMeal) {
  try {
    // Delete from children first
    await db.query("DELETE FROM meal_ingredients WHERE id_meal = $1", [idMeal]);
    await db.query("DELETE FROM meal_plans WHERE id_meal = $1", [idMeal]);
    await db.query("DELETE FROM meals WHERE id_meal = $1", [idMeal]);

    return true;
  } catch (err) {
    console.error("Error deleting meal:", err);
    throw err;
  }
}

// export async function getMealsByWeekDayAndUserId(weekDayId, userId) {
//   try {
//     const result = await db.query(
//       `SELECT m.*
//        FROM meal_plans mp
//        JOIN
//         meals m ON m.id_meal = mp.id_meal
//        WHERE
//         mp.id_day = $1 AND mp.id_user = $2
//        `,
//       [weekDayId, userId]
//     );
//     return result;
//   } catch (error) {
//     console.error("Error fetching meals by week day and user ID:", error);
//     return []; // fallback in case of error
//   }
// }

export async function getMealsInfoByWeekDayAndUserId(weekDayId, userId) {
  try {
    const result = await db.query(
      `SELECT 
  m.id_meal,
  m.name AS meal_name,
  m.description,
  m.category,
  COALESCE(
    json_agg(
      DISTINCT jsonb_build_object(
        'id_ingredient', i.id_ingredient,
        'name', i.name,
        'quantity', i.quantity,
        'unit', i.unit,
        'status', i.status
      )
    ) FILTER (WHERE i.id_ingredient IS NOT NULL),
    '[]'
  ) AS ingredients
FROM meal_plans mp
JOIN meals m ON m.id_meal = mp.id_meal
LEFT JOIN meal_ingredients mi ON m.id_meal = mi.id_meal
LEFT JOIN ingredients i ON mi.id_ingredient = i.id_ingredient
WHERE mp.id_day = $1 AND mp.id_user = $2
GROUP BY m.id_meal;

       `,
      [weekDayId, userId]
    );
    return result;
  } catch (error) {
    console.error("Error fetching meals by week day and user ID:", error);
    return { rows: [] };
  }
}
