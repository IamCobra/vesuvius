use VesuviusDB;


DROP PROCEDURE IF EXISTS FindReservationTimes;
DROP PROCEDURE IF EXISTS ReservationsOrdersOverviewByDate;
DROP PROCEDURE IF EXISTS SoldeDishesByDate;
DROP PROCEDURE IF EXISTS TotalIntakeByDate;
DROP PROCEDURE IF EXISTS ReservedTablesByDate;
DROP PROCEDURE IF EXISTS SetFreeTables;
DROP VIEW IF EXISTS RawReservationsTablesOverview;
DROP VIEW IF EXISTS ReservationsTablesOverview;
DROP VIEW IF EXISTS RawReservationsOrdersOverview;
DROP VIEW IF EXISTS ReservationsOrdersOverview;

CREATE VIEW RawReservationsTablesOverview AS 
SELECT * FROM ReservationTimes INNER JOIN Reservations
ON ReservationTimes.ReservationTimeID = Reservations.ReservationTime INNER JOIN ReservedTables 
ON Reservations.ReservationID = ReservedTables.Reservation;

CREATE VIEW ReservationsTablesOverview AS 
SELECT FreeTables, StartTime, EndTime, ReservationID, ReservationDate, COUNT(Diningtable) ReservedTables FROM RawReservationsTablesOverview
GROUP BY ReservationID;

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
SELECT IFNULL(SUM(Amount), 0), IFNULL(SUM(Amount * Price), 0), IFNULL(DishName, "NoDisches"), IFNULL(Price, 0) FROM ReservationsOrdersOverview 
WHERE ReservationsOrdersOverview.ReservationDate >= StartDate AND ReservationsOrdersOverview.ReservationDate <= EndDate
GROUP BY DishID;
END//

CREATE PROCEDURE TotalIntakeByDate(IN StartDate DATE, IN EndDate DATE)
BEGIN 
SELECT IFNULL(SUM(Amount * Price), 0) FROM ReservationsOrdersOverview
WHERE ReservationsOrdersOverview.ReservationDate BETWEEN StartDate AND EndDate;
END//

CALL TotalIntakeByDate('2025-08-10', '2015-08-14');

CREATE PROCEDURE ReservedTablesByDate (IN StartDate DATE, IN EndDate DATE)
BEGIN
SELECT IFNULL(ReservationID, 0), IFNULL(StartTime, '00:00:00'), IFNULL(EndTime, '00:00:00'), IFNULL(ReservationDate, '0001-01-01'), IFNULL(ReservedTables, 0) FROM ReservationsTablesOverview
WHERE ReservationDate >= StartDate AND ReservationDate <= EndDate GROUP BY ReservationID;
END//

CREATE PROCEDURE SetFreeTables()
BEGIN
UPDATE ReservationTimes 
SET FreeTables = (SELECT COUNT(*) FROM Diningtables) WHERE ReservationTimeID > 0;
END//
DELIMITER ;