-- USERS
CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    pic TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WEEKDAYS
CREATE TABLE week_days (
    id_day INT PRIMARY KEY,
    name NVARCHAR(50) NOT NULL
);

-- MEALS
CREATE TABLE meals (
    id_meal SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    id_user INT,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

-- INGREDIENTS
CREATE TABLE ingredients (
    id_ingredient SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    quantity VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    status VARCHAR(50)
);

-- MEAL INGREDIENTS (many-to-many)
CREATE TABLE meal_ingredients (
    id SERIAL PRIMARY KEY,
    id_meal INT NOT NULL,
    id_ingredient INT NOT NULL,
    FOREIGN KEY (id_meal) REFERENCES meals(id_meal),
    FOREIGN KEY (id_ingredient) REFERENCES ingredients(id_ingredient)
);

-- MEAL PLANS
CREATE TABLE meal_plans (
    id SERIAL PRIMARY KEY,
    id_day INT NOT NULL,
    id_meal INT NOT NULL,
    id_user INT NOT NULL,
    FOREIGN KEY (id_day) REFERENCES week_days(id_day),
    FOREIGN KEY (id_meal) REFERENCES meals(id_meal),
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);


-- WEEKDAYS
INSERT INTO week_days (id_day, name) VALUES
(1, 'Monday'),
(2, 'Tuesday'),
(3, 'Wednesday'),
(4, 'Thursday'),
(5, 'Friday'),
(6, 'Saturday'),
(7, 'Sunday');

-- USERS
INSERT INTO users (username, email, password_hash, pic)
VALUES 
('katie', 'katie@example.com', 'hashed_password_1', 'https://example.com/katie.jpg'),
('alex', 'alex@example.com', 'hashed_password_2', 'https://example.com/alex.jpg');

-- MEALS (user_id 1 = Katie)
INSERT INTO meals (category, name, description, id_user) VALUES
('Breakfast', 'Pancakes', 'Fluffy pancakes served with syrup and butter', 1),
('Lunch', 'Caesar Salad', 'Crisp romaine lettuce with Caesar dressing and croutons', 1),
('Dinner', 'Grilled Salmon', 'Salmon fillet grilled to perfection with lemon butter sauce', 1),
('Snack', 'Fruit Salad', 'A mix of seasonal fruits served chilled', 1),
('Snack', 'Chocolate Cake', 'Rich chocolate cake with creamy frosting', 1);

-- INGREDIENTS
INSERT INTO ingredients (name, quantity, unit, status) VALUES
('Flour', '1', 'cup', 'available'),
('Eggs', '2', 'pcs', 'available'),
('Milk', '1/2', 'cup', 'available'),
('Lettuce', '1', 'head', 'available'),
('Croutons', '1', 'cup', 'available'),
('Salmon', '1', 'fillet', 'available'),
('Mixed Fruits', '2', 'cups', 'available'),
('Chocolate', '100', 'grams', 'available');

-- MEAL_INGREDIENTS (example links)
INSERT INTO meal_ingredients (id_meal, id_ingredient) VALUES
(1, 1), (1, 2), (1, 3),       -- Pancakes
(2, 4), (2, 5),               -- Caesar Salad
(3, 6),                      -- Grilled Salmon
(4, 7),                      -- Fruit Salad
(5, 8);                      -- Chocolate Cake

-- MEAL_PLANS (Katie's weekly plan)
INSERT INTO meal_plans (id_day, id_meal, id_user) VALUES
(1, 1, 1),  -- Monday Breakfast
(2, 2, 1),  -- Tuesday Lunch
(3, 3, 1),  -- Wednesday Dinner
(4, 4, 1),  -- Thursday Snack
(5, 5, 1);  -- Friday Snack
