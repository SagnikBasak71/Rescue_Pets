require('dotenv').config();
const express = require('express');
const router = express.Router();

const User = require('../model/User');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

// ✅ Import multer and set up .none() for form-data parsing
const multer = require('../middleware/multer');
const upload = multer.none();

// Home route
router.get('/', (req, res) => {
    res.send("Welcome to the Pet Rescue User Portal!");
});

// ✅ Register User (Supports form-data without file)
router.post('/register', upload, async (req, res) => {
    try {
        const { name, email, password, contact, location } = req.body;

        if (!name || !email || !password || !contact || !location) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists with this email.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            contact,
            location
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: savedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Missing email or password", success: false });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            contact: user.contact,
            location: user.location
        };

        res.status(200)
            .cookie("token", token, { maxAge: 86400000, httpOnly: true, sameSite: 'strict' })
            .json({ message: `Welcome back ${user.name}`, user: userData, success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get all registered users
router.get('/getUsers', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Update user
router.patch('/update/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ Delete user
router.delete('/delete/:id', async (req, res) => {
    try {
        const data = await User.findByIdAndDelete(req.params.id);
        res.send(`User ${data?.name || 'data'} deleted successfully.`);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ Filter users by name (GET)
router.get('/filterByName/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const users = await User.find({ name: { $regex: name, $options: 'i' } });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
