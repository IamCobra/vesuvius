USE VesuviusDB;

SET @guests = 20;
SET @neededtables = 0;
SET @ReservationDate = '2025-08-17';
SELECT CEILING(@guests/2)
END INTO @neededtables;
SELECT @neededtables;

SELECT StartTime, EndTime FROM ReservationTimes
WHERE @neededtables <= ReservationTimes.FreeTables - (SELECT COUNT(*) FROM ReservationOverview
WHERE ReservationTimes.StartTime < ReservationOverview.EndTime AND ReservationTimes.EndTime > ReservationOverview.StartTime
AND ReservationOverview.ReservationDate = @ReservationDate);

CALL SetFreeTables;

SET @StartDate = '2025-08-15';
SET @EndDate = '2025-08-24';
SELECT * FROM ReservationsTablesOverview;

SELECT ReservationID, StartTime, EndTime, ReservationDate, ReservedTables FROM ReservationsTablesOverview
WHERE ReservationDate >= @StartDate AND ReservationDate <= @EndDate
GROUP BY ReservationID;

SELECT * FROM ReservationsOrdersOverview
WHERE ReservationsOrdersOverview.ReservationDate >= @StartDate AND ReservationsOrdersOverview.ReservationDate <= @EndDate;

SELECT SUM(Amount), SUM(Amount * Price), DishName, Price FROM ReservationsOrdersOverview 
WHERE ReservationsOrdersOverview.ReservationDate >= @StartDate AND ReservationsOrdersOverview.ReservationDate <= @EndDate
GROUP BY DishID;


SELECT SUM(Amount * Price) FROM ReservationsOrdersOverview
WHERE ReservationsOrdersOverview.ReservationDate BETWEEN @StartDate AND @EndDate;


CALL ReservationsByDate (@StartDate, @EndDate);
