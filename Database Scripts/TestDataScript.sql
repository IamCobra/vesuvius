USE VesuviusDB;


INSERT INTO Resevators (FirstName, LastName, Email, TelfNumber)
VALUES
('John', 'Doe', 'john.doe@example.com', 123456789),
('Jane', 'Smith', 'jane.smith@example.com', 987654321),
('Alice', 'Johnson', 'alice.j@example.com', 555123456),
('Bob', 'Brown', 'bob.brown@example.com', 444987654);

INSERT INTO Reservations (Resevator, Guests, ReservationDate, ReservationTime)
VALUES
(1, 2, '2025-08-15', 1),
(2, 4, '2025-08-16', 9),
(3, 3, '2025-08-17', 18),
(4, 1, '2025-08-17', 27);

INSERT INTO Diningtables (TableID)
VALUES
(1),
(2),
(3),
(4);

INSERT INTO ReservedTables(Diningtable, Reservation)
VALUES
(1,1),
(1,2),
(2,2),
(1,3),
(2,3),
(1,4);

INSERT INTO Orders (Reservation, State)
VALUES
(1, 'Ordered'),
(1, 'DishFinished'),
(2, 'Ordered'),
(3, 'OrderComplete'),
(4, 'Complication');

INSERT INTO Dishes (DishName, DishDescription, Price)
VALUES
('Margherita Pizza', 'Classic pizza with tomato, mozzarella, and basil.', 8.99),
('Caesar Salad', 'Crisp romaine lettuce, croutons, and parmesan with Caesar dressing.', 6.50),
('Grilled Salmon', 'Fresh salmon fillet with lemon butter sauce.', 15.75),
('Spaghetti Carbonara', 'Pasta with eggs, cheese, pancetta, and pepper.', 12.00),
('Chocolate Cake', 'Rich and moist chocolate cake with ganache.', 5.25);

INSERT INTO OrderedDishes (OrderedDish, Orderer, Amount)
VALUES
(1, 1, 2),  -- 2 Margherita Pizzas in order 1
(2, 1, 1),  -- 1 Caesar Salad in order 1
(3, 2, 1),  -- 1 Grilled Salmon in order 2
(4, 3, 2),  -- 2 Spaghetti Carbonaras in order 3
(5, 4, 3),  -- 3 Chocolate Cakes in order 4
(1, 5, 1);  -- 1 Margherita Pizza in order 5
