USE VesuviusDB;

DROP TABLE IF EXISTS OrderedDishes;
DROP TABLE IF EXISTS Dishes;
DROP TABLE IF EXISTS ReservedTables;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS DiningTables;
DROP TABLE IF EXISTS Reservations;
DROP TABLE IF EXISTS Resevators;
DROP TABLE IF EXISTS ReservationTimes;

CREATE TABLE ReservationTimes(
ReservationTimeID INT AUTO_INCREMENT,
StartTime TIME,
EndTime TIME,
FreeTables INT,
PRIMARY KEY (ReservationTimeID)
);

INSERT INTO ReservationTimes(StartTime, EndTime)
VALUES
('10:00:00','12:00:00'),
('10:15:00','12:15:00'),
('10:30:00','12:30:00'),
('10:45:00','12:45:00'),
('11:00:00','13:00:00'),
('11:15:00','13:15:00'),
('11:30:00','13:30:00'),
('11:45:00','13:45:00'),
('12:00:00','14:00:00'),
('12:15:00','14:15:00'),
('12:30:00','14:30:00'),
('12:45:00','14:45:00'),
('13:00:00','15:00:00'),
('13:15:00','15:15:00'),
('13:30:00','15:30:00'),
('13:45:00','15:45:00'),
('14:00:00','16:00:00'),
('14:15:00','16:15:00'),
('14:30:00','16:30:00'),
('14:45:00','16:45:00'),
('15:00:00','17:00:00'),
('15:15:00','17:15:00'),
('15:30:00','17:30:00'),
('15:45:00','17:45:00'),
('16:00:00','18:00:00'),
('16:15:00','18:15:00'),
('16:30:00','18:30:00'),
('16:45:00','18:45:00'),
('18:00:00','20:00:00'),
('18:15:00','20:15:00'),
('18:30:00','20:30:00'),
('18:45:00','20:45:00'),
('19:00:00','21:00:00'),
('19:15:00','21:15:00'),
('19:30:00','21:30:00'),
('19:45:00','21:45:00');

CREATE TABLE Resevators(
ResevatorID INT AUTO_INCREMENT,
FirstName VARCHAR(20),
LastName VARCHAR(20),
Email VARCHAR(60),
TelfNumber INT,
PRIMARY KEY (ResevatorID)
);

CREATE TABLE Reservations(
ReservationID INT AUTO_INCREMENT,
Resevator INT,
Guests INT,
ReservationDate DATE,
ReservationTime INT,
PRIMARY KEY (ReservationID),
FOREIGN KEY (Resevator) REFERENCES Resevators (ResevatorID),
FOREIGN KEY (ReservationTime) REFERENCES ReservationTimes (ReservationTimeID)
);

CREATE TABLE Diningtables(
TableID INT AUTO_INCREMENT,
PRIMARY KEY (TableID)
);

CREATE TABLE ReservedTables(
Diningtable INT,
Reservation INT,
FOREIGN KEY (Diningtable) REFERENCES Diningtables (TableID),
FOREIGN KEY (Reservation) REFERENCES Reservations (ReservationID)
);

CREATE TABLE Orders(
OrderID INT AUTO_INCREMENT,
Reservation INT,
State ENUM('Ordered', 'Complication', 'DishFinished', 'OrderComplete'),
PRIMARY KEY (OrderID),
FOREIGN KEY (Reservation) REFERENCES Reservations (ReservationID)
);

CREATE TABLE Dishes(
DishID INT AUTO_INCREMENT,
DishName VARCHAR(30),
DishDescription MEDIUMTEXT,
Price DOUBLE,
PRIMARY KEY (DishID)
);

CREATE TABLE OrderedDishes(
OrderedDish INT,
Orderer INT,
Amount INT,
FOREIGN KEY (OrderedDish) REFERENCES Dishes (DishID),
FOREIGN KEY (Orderer) REFERENCES Orders (OrderID)
);