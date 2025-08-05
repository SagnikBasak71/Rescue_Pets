const express = require('express');
const router = express.Router();
const Volunteer = require('../model/Volunteer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const upload = require('../middleware/multer'); // multer config
require('dotenv').config();

// ✅ 1. Register (image optional)
router.post('/register', upload.single('image'), async (req, res) => {
    try {
        const { email, name, password, contact, location } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!email || !name || !password || !contact || !location) {
            return res.status(400).json({ message: "All fields except image are required." });
        }

        const existingVolunteer = await Volunteer.findOne({ email });
        if (existingVolunteer) {
            return res.status(400).json({ message: "Email already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newVolunteer = new Volunteer({
            email,
            name,
            password: hashedPassword,
            contact,
            address:location,
         // store filename
        });

        await newVolunteer.save();
        res.status(201).json(newVolunteer);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ 2. Login
// ✅ 2. Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const volunteer = await Volunteer.findOne({ email });
        if (!volunteer) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, volunteer.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { volunteerId: volunteer._id },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login successful.",
            token,
            volunteer: {
                id: volunteer._id,
                email: volunteer.email,
                name: volunteer.name,
                contact: volunteer.contact,
                location: volunteer.address, // <-- Fixed here
                image: volunteer.image,
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ✅ 3. Update
router.patch('/update/:id', upload.single('image'), async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        if (req.file) {
            updatedData.image = req.file.filename;
        }

        const options = { new: true };
        const result = await Volunteer.findByIdAndUpdate(id, updatedData, options);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ✅ 4. Delete
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Volunteer.findByIdAndDelete(id);
        res.status(200).json({ message: `${result.name} has been deleted.` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ✅ 5. Get volunteer by ID
router.get('/getVolunteerById/:id', async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ message: "Volunteer not found" });
        }
        res.status(200).json(volunteer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ 6. Get All Volunteers (with image URLs if needed)
router.get('/getAll', async (req, res) => {
    try {
        const volunteers = await Volunteer.find();

        const volunteersWithImageUrl = volunteers.map(v => ({
            ...v._doc,
            image: v.image ? `${req.protocol}://${req.get('host')}/Uploads/${v.image}` : null,
        }));

        res.status(200).json(volunteersWithImageUrl);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
