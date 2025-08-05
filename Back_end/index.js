const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => console.log(error));
database.once('connected', () => console.log('Database Connected'));

const app = express();

// ✅ Fix: Add Both Middlewares
app.use(express.json());                              // Parse JSON
app.use(express.urlencoded({ extended: true }));      // Parse x-www-form-urlencoded

// Home Route
app.get('/', function (req, res) {
    res.send("This is Home Page of Pet Rescue Department....!!!");
});

// Serve Uploaded Images
app.use('/Uploads', express.static('Uploads'));

// User Controller
const userController = require('./controller/userController');
app.use('/users', userController);

// Volunteer Controller
const volunteerController = require('./controller/volunteerController');
app.use('/volunteers', volunteerController);

// Pet Controller
const petController = require('./controller/petController');
app.use('/pets', petController);

// Admin Controller
const adminController = require('./controller/adminController');
app.use('/admins', adminController);

app.listen(4000, () => {
    console.log(`Server Started at 4000`);
});
