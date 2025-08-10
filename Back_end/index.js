const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const mongoString = process.env.DATABASE_URL;

// Connect to MongoDB
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => console.log(error));
database.once('connected', () => console.log('Database Connected'));

const app = express();

// ✅ Middlewares for parsing requests
app.use(express.json());                              // Parse JSON
app.use(express.urlencoded({ extended: true }));      // Parse x-www-form-urlencoded

// Home Route
app.get('/', (req, res) => {
    res.send("This is Home Page of Pet Rescue Department....!!!");
});

// Serve Uploaded Images
app.use('/Uploads', express.static('Uploads'));

// ✅ Controllers
const userController = require('./controller/userController');
const volunteerController = require('./controller/volunteerController');
const petController = require('./controller/petController');
const adminController = require('./controller/adminController');

// ✅ Use /api prefix for all routes
app.use('/api/users', userController);
app.use('/api/volunteers', volunteerController);
app.use('/api/pets', petController);
app.use('/api/admins', adminController);

// Start Server
app.listen(4000, () => {
    console.log(`🚀 Server Started at http://localhost:4000`);
});
