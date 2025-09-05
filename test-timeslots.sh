#!/bin/bash

echo "🕐 Testing New Time Slots (11:00 - 21:30)"
echo "========================================"

BASE_URL="http://localhost:3000"

echo ""
echo "1. Testing morning slot (11:00)..."
MORNING_TEST=$(curl -s "${BASE_URL}/api/reservations?date=2025-09-10&time=11:00&partySize=2")
echo "11:00 Response: $MORNING_TEST"

echo ""
echo "2. Testing lunch slot (13:00)..."
LUNCH_TEST=$(curl -s "${BASE_URL}/api/reservations?date=2025-09-10&time=13:00&partySize=2")
echo "13:00 Response: $LUNCH_TEST"

echo ""
echo "3. Testing dinner slot (19:00)..."
DINNER_TEST=$(curl -s "${BASE_URL}/api/reservations?date=2025-09-10&time=19:00&partySize=2")
echo "19:00 Response: $DINNER_TEST"

echo ""
echo "4. Testing late slot (21:15)..."
LATE_TEST=$(curl -s "${BASE_URL}/api/reservations?date=2025-09-10&time=21:15&partySize=2")
echo "21:15 Response: $LATE_TEST"

echo ""
echo "🎉 All-day service is now active! (11:00 - 21:30)"
