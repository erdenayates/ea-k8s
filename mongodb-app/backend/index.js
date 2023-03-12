const newrelic = require('newrelic');
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB with admin-user credentials
mongoose.connect('mongodb://usersAdmin:usersAdmin@34.29.34.239:27017/users', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define a schema for the user data
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});

// Define a model for the user data
const User = mongoose.model('User', userSchema);

// Define a route to get all users
app.get('/users', async (req, res) => {
  try {
    const client = await MongoClient.connect('mongodb://usersAdmin:usersAdmin@34.29.34.239:27017/users', { useNewUrlParser: true });
    const database = client.db('users');
    const collection = database.collection('users');
    const users = await collection.find().toArray();
    res.json(users);
    client.close();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving users from database');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});