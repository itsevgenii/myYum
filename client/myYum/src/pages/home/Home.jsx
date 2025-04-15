import React, { useState, useEffect, Fragment } from "react";
import styles from "./Home.module.css";

import del from "../../assets/del.png";
import exp from "../../assets/exp.png";

const Home = () => {
  const [selectedDayId, setSelectedDayId] = useState(1);
  const [meals, setMeals] = useState([]);

  const [selectedMeal, setSelectedMeal] = useState(null);

  const userId = 1;
  const MAX_MEALS = 7;

  const daysOfTheWeek = [
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" },
    { id: 7, name: "Sunday" },
  ];

  const fetchMealsByDay = async (dayId) => {
    try {
      const response = await fetch(
        `http://localhost:3003/${dayId}?userId=${userId}`
      );
      if (!response.ok) throw new Error("Network error");
      const data = await response.json();

      const actualMeals = data.meals || [];
      const filledMeals = [...actualMeals];
      while (filledMeals.length < MAX_MEALS) {
        filledMeals.push({
          id_meal: `placeholder-${filledMeals.length}`,
          isPlaceholder: true,
        });
      }

      setMeals(filledMeals);
    } catch (err) {
      console.error("Failed to fetch meals:", err);
    }
  };

  useEffect(() => {
    const fetchAndSetMeals = async () => {
      try {
        const response = await fetch(
          `http://localhost:3003/${selectedDayId}?userId=${userId}`
        );
        if (!response.ok) throw new Error("Network error");
        const data = await response.json();

        const actualMeals = data.meals || [];

        // Enforce 1 breakfast, 1 lunch, 1 dinner — allow multiple snacks
        const uniqueMeals = {
          breakfast: null,
          lunch: null,
          dinner: null,
        };
        const snacks = [];
        const others = [];

        actualMeals.forEach((meal) => {
          const category = meal.category?.toLowerCase();
          if (["breakfast", "lunch", "dinner"].includes(category)) {
            if (!uniqueMeals[category]) {
              uniqueMeals[category] = meal;
            }
          } else if (category === "snack") {
            snacks.push(meal);
          } else {
            others.push(meal); // optional: brunch, supper, etc.
          }
        });

        // Merge everything together
        let finalMeals = Object.values(uniqueMeals)
          .filter(Boolean)
          .concat(snacks)
          .concat(others);

        // Cap at 7
        finalMeals = finalMeals.slice(0, MAX_MEALS);

        // Add placeholders if needed
        while (finalMeals.length < MAX_MEALS) {
          finalMeals.push({
            id_meal: `placeholder-${finalMeals.length}`,
            isPlaceholder: true,
          });
        }

        setMeals(finalMeals);

        // Select breakfast first, otherwise any real meal
        const defaultMeal =
          finalMeals.find(
            (m) => !m.isPlaceholder && m.category?.toLowerCase() === "breakfast"
          ) ||
          finalMeals.find((m) => !m.isPlaceholder) ||
          null;

        setSelectedMeal(defaultMeal);
      } catch (err) {
        console.error("Failed to fetch meals:", err);
      }
    };

    fetchAndSetMeals();
  }, [selectedDayId]);

  console.log("Meals fetched:", meals);

  const handleDeleteMeal = async (mealId) => {
    try {
      const response = await fetch(`http://localhost:3003/${mealId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Network error");
      const data = await response.json();
      console.log("Meal deleted:", data);
      // Optionally, update the meals state to remove the deleted meal
      setMeals((prevMeals) =>
        prevMeals.filter((meal) => meal.id_meal !== mealId)
      );
      // Optionally, refetch meals or update state to reflect deletion
    } catch (err) {
      console.error("Failed to delete meal:", err);
    }
  };

  return (
    <div className={styles.grid}>
      {daysOfTheWeek.map((day, index) => {
        const meal = meals[index];
        return (
          <Fragment key={day.id}>
            {/* Day label */}
            <div
              className={`${styles.dayLabel} ${
                selectedDayId === day.id ? styles.selected : ""
              }`}
              onClick={() => setSelectedDayId(day.id)}
            >
              {day.name}
            </div>

            {/* Meal button */}
            <div className={styles.meal}>
              {meal?.isPlaceholder ? (
                <div className={`${styles.mealButton} ${styles.placeholder}`}>
                  + Add Meal
                </div>
              ) : (
                <div className={styles.mealButton}>
                  <h5>
                    {meal?.name} <span>{meal?.category}</span>
                  </h5>
                  <p>{meal?.description}</p>
                </div>
              )}
            </div>

            {/* Action icons */}
            <div className={styles.icons}>
              {!meal?.isPlaceholder && (
                <>
                  <img
                    src={exp}
                    alt="expand"
                    className={styles.icon}
                    onClick={() =>
                      setSelectedMeal((prev) =>
                        prev?.id_meal === meal.id_meal ? null : meal
                      )
                    }
                  />
                  <img
                    src={del}
                    alt="delete"
                    className={styles.icon}
                    onClick={() => handleDeleteMeal(meal.id_meal)}
                  />
                </>
              )}
            </div>
          </Fragment>
        );
      })}

      {/* 👇 Preview column, now only once, stretches over all rows */}
      <div
        className={styles.preview}
        style={{ gridRow: `1 / span ${MAX_MEALS}` }}
      >
        {selectedMeal && !selectedMeal.isPlaceholder && (
          <div className={styles.mealDetails}>
            <h4>{selectedMeal.meal_name}</h4>
            <p>
              <strong>Category:</strong> {selectedMeal.category}
            </p>
            <p>
              <strong>Description:</strong> {selectedMeal.description}
            </p>

            {Array.isArray(selectedMeal.ingredients) &&
            selectedMeal.ingredients.length > 0 ? (
              <>
                <h5>Ingredients:</h5>
                <ul>
                  {selectedMeal.ingredients.map((ingredient) => (
                    <li key={ingredient.id_ingredient}>
                      {ingredient.quantity} {ingredient.unit} of{" "}
                      {ingredient.name} ({ingredient.status})
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>
                <em>No ingredients found for this meal.</em>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
