import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";

const Home = () => {
  const [dataWeekDays, setDataWeekDays] = useState([]);
  const [data, setData] = useState([
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" },
    { id: 7, name: "Sunday" },
  ]);
  const [meals, setMeals] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3003/");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const dataWeekDays = await response.json();
      const meals = dataWeekDays.meals;
      setMeals(meals);
      setDataWeekDays(dataWeekDays.weekDays);
      console.log(dataWeekDays);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {data.map((item) => (
          <li key={item.id} className={styles.item}>
            <h1 className={styles.title}>
              <a href="#" className={styles.link}>
                {item.name}
              </a>
            </h1>
          </li>
        ))}
      </ul>
      <div className={styles.mealsContainer}>
        <ul className={styles.mealsList}>
          {meals.map((meal) => (
            <li key={meal.id} className={styles.mealItem}>
              <h3 className={styles.mealName}>{meal.name}</h3>
              <p className={styles.mealDescription}>{meal.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
