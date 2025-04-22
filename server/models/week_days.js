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
        m.id_user,
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
      WHERE m.id_user = $1
      GROUP BY m.id_meal`,
      [userId]
    );
    return result;
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

export async function addMealsByWeekDayAndUserId(
  weekDayId,
  userId,
  mealId,
  mealName,
  mealDescription,
  mealCategory
) {
  try {
    const result = await db.query(
      `INSERT INTO meals (id_meal, name, description, category, id_user)
        VALUES ($1, $2, $3, $4, $5) RETURNING id_meal, name, description, category`,
      [mealId, mealName, mealDescription, mealCategory, userId]
    );

    await db.query(
      `INSERT INTO meal_plans (id_day, id_meal, id_user)
        VALUES ($1, $2, $3)`,
      [weekDayId, mealId, userId]
    );

    return result;
  } catch (error) {
    console.error("Error adding meals by week day and user ID:", error);
    return { rows: [] };
  }
}
