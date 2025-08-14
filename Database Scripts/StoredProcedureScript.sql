use VesuviusDB;


DROP PROCEDURE IF EXISTS FindReservationTimes;
DROP PROCEDURE IF EXISTS ReservationsByDate;
DROP PROCEDURE IF EXISTS SetFreeTables;
DROP VIEW IF EXISTS ReservationsTablesOverview;

CREATE VIEW ReservationsTablesOverview AS 
SELECT * FROM ReservationTimes INNER JOIN Reservations
ON ReservationTimes.ReservationTimeID = Reservations.ReservationTime INNER JOIN ReservedTables 
ON Reservations.ReservationID = ReservedTables.Reservation;

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

CREATE PROCEDURE SetFreeTables()
BEGIN
UPDATE ReservationTimes 
SET FreeTables = (SELECT COUNT(*) FROM Diningtables) WHERE ReservationTimeID > 0;
END//

CREATE PROCEDURE ReservationsByDate(IN StartDate DATE, IN EndDate DATE)
BEGIN
SELECT * FROM Reservations INNER JOIN Orders
ON Reservations.ReservationID = Orders.Reservation 
WHERE Reservations.ReservationDate >= @StartDate AND Reservations.ReservationDate <= @EndDate;
END//
DELIMITER ;