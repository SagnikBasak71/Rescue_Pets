const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => console.log(error));
database.once('connected', () => console.log('Database Connected'));

const app = express();
app.use(express.json());

app.get('/', function (req, res) {
    res.send("This is Home Page of Pet REscue Department....!!!");
});

// To serve uploaded images
app.use('/Uploads', express.static('Uploads'));

// User Controller
const petscontroller = require('./controller/userController');
app.use('/pets', petscontroller);

// Volunteer Controller
const volunteerController = require('./controller/volunteerController');
app.use('/volunteers', volunteerController);

app.listen(4000, () => {
    console.log(`Server Started at ${4000}`);
});
