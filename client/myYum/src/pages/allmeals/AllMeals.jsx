import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";

import styles from "./AllMeals.module.css";

const AllMeals = () => {
  const { state } = useUser();
  const userId = state.userId;

  console.log("User ID from context:", userId);
  // console.log("Meals from context:", meals);

  const [meals, setMeals] = useState([]);

  const fetchMeals = async () => {
    try {
      const response = await fetch(`http://localhost:3003/?userId=${userId}`);
      if (!response.ok) throw new Error("Network error");
      const data = await response.json();
      const actualMeals = data.meals || [];
      console.log("Fetched meals:", data);
      console.log("Actual meals:", actualMeals);
      setMeals(actualMeals);
    } catch (err) {
      console.error("Failed to fetch meals:", err);
    }
  };
  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <div className={styles.wrapper}>
      {meals &&
        meals.map((meal) => (
          <div key={meal.id_meal} className={styles.meal}>
            <div className={styles.title}>
              <h5>{meal.meal_name}</h5>
              <h5>Category: {meal.category}</h5>
            </div>
            <div className={styles.description}>
              <p>{meal.description}</p>
            </div>
            <div className={styles.img_ingredientsContainer}>
              <div className={styles.image}>
                <img
                  src="https://www.shutterstock.com/image-photo/vegan-burrito-bowl-filled-rice-600nw-2493432903.jpg"
                  alt="meal.name"
                  className={styles.image}
                />
              </div>
              <div className={styles.ingredientsTable}>
                <div className={styles.tableHeader}>
                  <span>Name</span>
                  <span>Quantity</span>
                  <span>Unit</span>
                </div>

                {meal.ingredients &&
                  meal.ingredients.map((ingredient) => (
                    <div
                      key={ingredient.id_ingredient}
                      className={styles.tableRow}
                    >
                      <span>{ingredient.name}</span>
                      <span>{ingredient.quantity}</span>
                      <span>{ingredient.unit}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AllMeals;
