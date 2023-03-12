#!/bin/bash

# Define the MongoDB connection string
MONGO_URI="mongodb://usersAdmin:usersAdmin@34.29.34.239:27017/users"

# Define the function to generate a random user object
function generate_random_user() {
  local first_names=("Alice" "Bob" "Charlie" "David" "Emma" "Frank" "Grace" "Hannah" "Isaac" "Julia")
  local last_names=("Anderson" "Brown" "Clark" "Davis" "Edwards" "Ford" "Garcia" "Hernandez" "Ivanov" "Jones")
  local domains=("example.com" "test.com" "example.net" "test.net")
  local name="${first_names[$((RANDOM % 10))]} ${last_names[$((RANDOM % 10))]}"
  local email="$(echo "${name,,}" | tr ' ' '.')@${domains[$((RANDOM % 4))]}"
  local age=$((RANDOM % 60 + 18))
  echo "{ name: \"$name\", email: \"$email\", age: $age }"
}

# Insert 100 random user documents
for i in {1..100}; do
  user=$(generate_random_user)
  mongosh "$MONGO_URI" --eval "db.users.insertOne($user)"
done

echo "Inserted 100 random user documents."