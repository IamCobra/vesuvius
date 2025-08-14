use VesuviusDB;


DROP PROCEDURE IF EXISTS FindReservationTimes;
DROP PROCEDURE IF EXISTS ReservationsByDate;
DROP VIEW IF EXISTS ReservationOverview;

CREATE VIEW ReservationOverview AS 
SELECT * FROM ReservationTimes INNER JOIN Reservations
ON ReservationTimes.ReservationTimeID = Reservations.ReservationTime INNER JOIN ReservedTables 
ON Reservations.ReservationID = ReservedTables.Reservation;

DELIMITER //
CREATE PROCEDURE FindReservationTimes(IN Guests INT, IN ReservationDate DATE)
BEGIN
SELECT CEILING(Guests/2)
END INTO @neededtables;

SELECT StartTime, EndTime FROM ReservationTimes
WHERE @neededtables <= ReservationTimes.FreeTables - (SELECT COUNT(*) FROM ReservationOverview
WHERE ReservationTimes.StartTime < ReservationOverview.EndTime AND ReservationTimes.EndTime > ReservationOverview.StartTime
AND ReservationOverview.ReservationDate = @ReservationDate);
END//

CREATE PROCEDURE ReservationsByDate(IN StartDate DATE, IN EndDate DATE)
BEGIN
SELECT * FROM Reservations WHERE ReservationDate >= StartDate OR ReservationDate <= EndDate;
END//
DELIMITER ;