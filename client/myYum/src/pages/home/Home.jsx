import React, { useState, useEffect, Fragment } from "react";
import styles from "./Home.module.css";

import del from "../../assets/del.png";
import exp from "../../assets/exp.png";

const Home = () => {
  const [selectedDayId, setSelectedDayId] = useState(1);
  const [meals, setMeals] = useState([]);

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
    fetchMealsByDay(selectedDayId);
  }, [selectedDayId]);

  return (
    <div className={styles.grid}>
      {daysOfTheWeek.map((day, index) => {
        const meal = meals[index];

        return (
          <Fragment key={day.id}>
            <div
              className={`${styles.dayLabel} ${
                selectedDayId === day.id ? styles.selected : ""
              }`}
              onClick={() => setSelectedDayId(day.id)}
            >
              {day.name}
            </div>

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

            <div className={styles.icons}>
              {!meal?.isPlaceholder && (
                <>
                  <img
                    src={exp}
                    alt="expand"
                    className={styles.icon}
                    onClick={() => console.log("Expand", meal)}
                  />
                  <img
                    src={del}
                    alt="delete"
                    className={styles.icon}
                    onClick={() => console.log("Delete", meal)}
                  />
                </>
              )}
            </div>

            <div className={styles.preview}>
              {/* Placeholder for future expanded content */}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default Home;
