#!/bin/bash

BASE_URL="http://localhost:3000/api/auth"

echo "1. Registering User..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}')

echo "Response: $REGISTER_RESPONSE"
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"accessToken":"[^"]*' | grep -o '[^"]*$')

if [ -z "$TOKEN" ]; then
  echo "Registration failed or token not found."
  # Try login if user already duplicates
  echo "Attempting login..."
  LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
    -H "Content-Type: application/json" \
    -d '{"email": "test@example.com", "password": "password123"}')
  echo "Response: $LOGIN_RESPONSE"
  TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | grep -o '[^"]*$')
fi

echo ""
echo "Token: $TOKEN"

if [ -n "$TOKEN" ]; then
  echo ""
  echo "2. Accessing Protected Route (/me)..."
  curl -X GET "$BASE_URL/me" \
    -H "Authorization: Bearer $TOKEN"
else
  echo "Skipping protected route check due to missing token."
fi

echo ""
echo "Done."
