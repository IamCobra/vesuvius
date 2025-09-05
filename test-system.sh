#!/bin/bash

# Test script for Vesuvius reservation system
echo "🧪 Testing Vesuvius Reservation System"
echo "======================================="

BASE_URL="http://localhost:3000"

echo ""
echo "1. Testing availability check..."
AVAILABILITY=$(curl -s "${BASE_URL}/api/reservations?date=2025-09-05&time=19:00&partySize=2")
echo "Response: $AVAILABILITY"

if echo "$AVAILABILITY" | grep -q '"success":true'; then
    echo "✅ Availability check working"
else
    echo "❌ Availability check failed"
fi

echo ""
echo "2. Testing reservation creation..."
RESERVATION_DATA='{
  "date": "2025-09-05",
  "time": "18:00",
  "partySize": 2,
  "customerData": {
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "12345678"
  }
}'

RESERVATION_RESULT=$(curl -s -X POST "${BASE_URL}/api/reservations" \
  -H "Content-Type: application/json" \
  -d "$RESERVATION_DATA")

echo "Response: $RESERVATION_RESULT"

if echo "$RESERVATION_RESULT" | grep -q '"success":true'; then
    echo "✅ Reservation creation working"
else
    echo "❌ Reservation creation failed"
fi

echo ""
echo "3. Testing double-booking prevention..."
# Try to book the same time slot again
DOUBLE_BOOK=$(curl -s -X POST "${BASE_URL}/api/reservations" \
  -H "Content-Type: application/json" \
  -d "$RESERVATION_DATA")

echo "Response: $DOUBLE_BOOK"

if echo "$DOUBLE_BOOK" | grep -q '"success":false'; then
    echo "✅ Double-booking prevention working"
else
    echo "❌ Double-booking prevention failed"
fi

echo ""
echo "🎉 Test completed!"
