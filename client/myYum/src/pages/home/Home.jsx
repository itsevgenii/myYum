import React, { useState, useEffect, Fragment } from "react";
import { useUser } from "../../context/UserContext";
import styles from "./Home.module.css";

const Home = () => {
  let today = new Date();
  let day = today.getDay();
  const daysOfTheWeek = [
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" },
    { id: 7, name: "Sunday" },
  ];
  console.log("Today is: ", day);

  const [selectedDayId, setSelectedDayId] = useState(day);
  daysOfTheWeek[day - 1].id = day; // Set the id of the current day to the current day of the week
  console.log("today is: ", daysOfTheWeek[day - 1].name);

  const [meals, setMeals] = useState([]);
  const [addMealClicked, setAddMealClicked] = useState(false);

  const [selectedMeal, setSelectedMeal] = useState(null);

  // const userId = 1;
  const { dispatch, state } = useUser();
  const userId = state.userId;
  console.log("User ID from context:", userId);

  const MAX_MEALS = 7;

  const fetchMealsByDay = async (dayId) => {
    try {
      const response = await fetch(
        `https://myyum.onrender.com/${dayId}?userId=${userId}`
      );
      if (!response.ok) throw new Error("Network error");
      const data = await response.json();

      const actualMeals = data.meals || [];
      //actual meals is for the current day
      console.log("Actual meals:", actualMeals);
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
    if (!userId) return; // 👈 Don't run the effect if userId is not ready
    const fetchAndSetMeals = async () => {
      if (!userId) {
        return <p>Loading your meal plan...</p>;
      }

      try {
        const response = await fetch(
          `https://myyum.onrender.com/${selectedDayId}?userId=${userId}`
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

        // dispatch({
        //   type: "ADD_MEAL",
        //   payload: finalMeals,
        // });
      } catch (err) {
        console.error("Failed to fetch meals:", err);
      }
    };

    fetchAndSetMeals();
  }, [selectedDayId]);

  console.log("Meals fetched:", meals);

  const handleDeleteMeal = async (mealId) => {
    try {
      const response = await fetch(`https://myyum.onrender.com/${mealId}`, {
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

  const handleAddMeal = async (dayId, mealId) => {
    try {
      const response = await fetch(`https://myyum.onrender.com/${dayId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, mealId }),
      });
      if (!response.ok) throw new Error("Network error");
      const data = await response.json();
      console.log("Meal added:", data);
      // Optionally, update the meals state to include the new meal
      setMeals((prevMeals) => [...prevMeals, data]);
      // Optionally, refetch meals or update state to reflect addition
      setMeals((prevMeals) =>
        prevMeals.filter((meal) => meal.id_meal !== mealId)
      );
    } catch (err) {
      console.error("Failed to add meal:", err);
    }
  };

  return (
    <div className={styles.Home}>
      <div className={styles.weekDays}>
        {daysOfTheWeek.map((day) => (
          <div
            key={day.id}
            className={`${styles.dayLabel} ${
              selectedDayId === day.id ? styles.selected : ""
            }`}
            onClick={() => {
              setSelectedDayId(day.id);
              fetchMealsByDay(day.id);
            }}
          >
            {day.name}
          </div>
        ))}
      </div>
      <div className={styles.mealsContainer}>
        <div className={styles.MealsCards}>
          {/* {meals &&
            meals.map((meal) => (
              <div key={meal.id_meal} className={styles.mealCard}>
                <div className={styles.mealDetails}>
                  <h5>{meal.category}</h5>
                  <h4>{meal.meal_name}</h4>
                  <p>{meal.description}</p>
                </div>
                <div
                  className={styles.icons}
                  onClick={() => {
                    setSelectedMeal(meal);
                  }}
                >
                  😋
                </div>
              </div>
            ))} */}
          {meals &&
            meals.map((meal) =>
              meal.isPlaceholder ? (
                <div
                  key={meal.id_meal}
                  className={`${styles.mealCard} ${styles.placeholderCard}`}
                  onClick={() => setAddMealClicked(true)}
                >
                  <div className={styles.placeholderContent}>
                    <span className={styles.playIcon}>+</span>
                    <p>Add Meal</p>
                  </div>
                </div>
              ) : (
                <div key={meal.id_meal} className={styles.mealCard}>
                  <div className={styles.mealDetails}>
                    <h5>{meal.category}</h5>
                    <h4>{meal.meal_name}</h4>
                    <p>{meal.description}</p>
                  </div>
                  <div
                    className={styles.icons}
                    onClick={() => {
                      setSelectedMeal(meal);
                    }}
                  >
                    😋
                  </div>
                </div>
              )
            )}
        </div>
        <div className={styles.expandedMealContainer}>
          {selectedMeal && !selectedMeal.isPlaceholder && (
            <div className={styles.expandedMeal}>
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
              <div className={styles.imageContainer}>
                <img
                  src="https://www.shutterstock.com/image-photo/vegan-burrito-bowl-filled-rice-600nw-2493432903.jpg"
                  alt={selectedMeal.meal_name}
                  className={styles.image}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {addMealClicked && (
        <div className={styles.addMealModal}>
          <h4>Add Meal</h4>
          <button
            onClick={() => {
              handleAddMeal(selectedDayId, selectedMeal.id_meal);
              setAddMealClicked(false);
            }}
          >
            Add
          </button>
          <button onClick={() => setAddMealClicked(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Home;
