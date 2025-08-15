use VesuviusDB;


DROP PROCEDURE IF EXISTS FindReservationTimes;
DROP PROCEDURE IF EXISTS ReservationsOrdersOverviewByDate;
DROP PROCEDURE IF EXISTS SoldeDishesByDate;
DROP PROCEDURE IF EXISTS TotalIntakeByDate;
DROP PROCEDURE IF EXISTS SetFreeTables;
DROP VIEW IF EXISTS ReservationsTablesOverview;
DROP VIEW IF EXISTS RawReservationsOrdersOverview;
DROP VIEW IF EXISTS ReservationsOrdersOverview;

CREATE VIEW ReservationsTablesOverview AS 
SELECT * FROM ReservationTimes INNER JOIN Reservations
ON ReservationTimes.ReservationTimeID = Reservations.ReservationTime INNER JOIN ReservedTables 
ON Reservations.ReservationID = ReservedTables.Reservation;

CREATE VIEW RawReservationsOrdersOverview AS
SELECT * FROM Reservations INNER JOIN Orders
ON Reservations.ReservationID = Orders.Reservation INNER JOIN OrderedDishes
ON Orders.OrderID = OrderedDishes.Orderer INNER JOIN Dishes
ON OrderedDishes.OrderedDish = Dishes.DishID;

CREATE VIEW ReservationsOrdersOverview AS
SELECT ReservationID, ReservationDate, OrderID, DishID, Amount, DishName, Price FROM RawReservationsOrdersOverview;

DELIMITER //
CREATE PROCEDURE FindReservationTimes(IN Guests INT, IN ReservationDate DATE)
BEGIN
SET @neededtables = 0;
SELECT CEILING(Guests/2)
END INTO @neededtables;

SELECT StartTime, EndTime FROM ReservationTimes
WHERE @neededtables <= ReservationTimes.FreeTables - (SELECT COUNT(*) FROM ReservationsTablesOverview
WHERE ReservationTimes.StartTime < ReservationOverview.EndTime AND ReservationTimes.EndTime > ReservationOverview.StartTime
AND ReservationOverview.ReservationDate = ReservationDate);
END//

CREATE PROCEDURE ReservationsOrdersOverviewByDate(IN StartDate DATE, IN EndDate DATE)
BEGIN
SELECT * FROM ReservationsOrdersOverview
WHERE ReservationsOrdersOverview.ReservationDate >= StartDate AND ReservationsOrdersOverview.ReservationDate <= EndDate;
END//

CREATE PROCEDURE SoldeDishesByDate(IN StartDate DATE, IN EndDate DATE)
BEGIN
SELECT SUM(Amount), SUM(Amount * Price), DishName, Price FROM ReservationsOrdersOverview 
WHERE ReservationsOrdersOverview.ReservationDate >= StartDate AND ReservationsOrdersOverview.ReservationDate <= EndDate
GROUP BY DishID;
END//

CREATE PROCEDURE TotalIntakeByDate(IN StartDate DATE, IN EndDate DATE)
BEGIN
SELECT SUM(Amount * Price) FROM ReservationsOrdersOverview
WHERE ReservationsOrdersOverview.ReservationDate >= StartDate AND ReservationsOrdersOverview.ReservationDate <= EndDate;
END//

CREATE PROCEDURE SetFreeTables()
BEGIN
UPDATE ReservationTimes 
SET FreeTables = (SELECT COUNT(*) FROM Diningtables) WHERE ReservationTimeID > 0;
END//
DELIMITER ;