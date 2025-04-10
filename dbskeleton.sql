-- Weekdays Table
CREATE TABLE week_days (
    id_day INT PRIMARY KEY,
    name NVARCHAR(50) NOT NULL
);

INSERT INTO week_days (id_day, name) VALUES
(1, 'Monday'),
(2, 'Tuesday'),
(3, 'Wednesday'),
(4, 'Thursday'),
(5, 'Friday'),
(6, 'Saturday'),
(7, 'Sunday');

-- Meals Table (no longer tied directly to weekdays)
CREATE TABLE meals (
    id_meal INT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    name NVARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL
);

INSERT INTO meals (id_meal, category, name, description) VALUES
(1, 'Breakfast', 'Pancakes', 'Fluffy pancakes served with syrup and butter'),
(2, 'Lunch', 'Caesar Salad', 'Crisp romaine lettuce with Caesar dressing and croutons'),
(3, 'Dinner', 'Grilled Salmon', 'Salmon fillet grilled to perfection with lemon butter sauce'),
(4, 'Snack', 'Fruit Salad', 'A mix of seasonal fruits served chilled'),
(5, 'Snack', 'Chocolate Cake', 'Rich chocolate cake with creamy frosting');

-- Ingredients Table (independent of meals)
CREATE TABLE ingredients (
    id_ingredient INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    quantity VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    status VARCHAR(50)
);

-- Meal_Ingredients Join Table (many-to-many)
CREATE TABLE meal_ingredients (
    id INT PRIMARY KEY,
    id_meal INT NOT NULL,
    id_ingredient INT NOT NULL,
    FOREIGN KEY (id_meal) REFERENCES meals(id_meal),
    FOREIGN KEY (id_ingredient) REFERENCES ingredients(id_ingredient)
);

-- Meal Plans Table (assigns meals to days)
CREATE TABLE meal_plans (
    id INT PRIMARY KEY,
    id_day INT NOT NULL,
    id_meal INT NOT NULL,
    FOREIGN KEY (id_day) REFERENCES week_days(id_day),
    FOREIGN KEY (id_meal) REFERENCES meals(id_meal)
);

