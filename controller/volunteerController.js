require('dotenv').config();
const express = require('express');
const router = express.Router();

const Volunteer = require('../model/Volunteer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const multer = require('../middleware/multer');
const upload = multer.none();

// 🔥 TEMP TOKEN STORAGE
const resetTokens = {};


// ================== REGISTER ==================
router.post('/register', upload, async (req, res) => {
    try {
        const { email, name, password, contact, location } = req.body;

        if (!email || !name || !password || !contact || !location) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const existing = await Volunteer.findOne({ email });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newVolunteer = new Volunteer({
            email,
            name,
            password: hashedPassword,
            contact,
            address: location
        });

        await newVolunteer.save();

        res.status(201).json({
            success: true,
            message: "Volunteer registered successfully"
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


// ================== LOGIN ==================
router.post('/login', upload, async (req, res) => {
    try {
        const { email, password } = req.body;

        const volunteer = await Volunteer.findOne({ email });

        if (!volunteer) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, volunteer.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { volunteerId: volunteer._id },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            volunteer: {
                id: volunteer._id,
                email: volunteer.email,
                name: volunteer.name
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


// ================== FORGOT PASSWORD ==================
router.post('/forgot-password', upload, async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const volunteer = await Volunteer.findOne({ email });

        if (!volunteer) {
            return res.status(404).json({
                success: false,
                message: "Volunteer not found"
            });
        }

        // 🔥 Generate token
        const token = crypto.randomBytes(32).toString('hex');

        // Store token
        resetTokens[token] = {
            volunteerId: volunteer._id,
            expires: Date.now() + 10 * 60 * 1000 // 10 min
        };

        // 🔥 Mail setup
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });

        // 🔥 SEND LINK (BROWSER)
        const resetLink = `http://192.168.0.101:4000/api/volunteers/reset-password/${token}`;

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Volunteer Password Reset",
            text: `Click the link to reset your password:\n${resetLink}`
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: "Reset link sent to your email"
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


// ================== SHOW RESET PAGE ==================
router.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;

    res.send(`
        <html>
        <head>
            <title>Reset Password</title>
            <style>
                body { font-family: Arial; text-align: center; margin-top: 100px; }
                input { padding: 10px; width: 250px; }
                button { padding: 10px 20px; background: green; color: white; border: none; }
            </style>
        </head>
        <body>
            <h2>Volunteer Reset Password</h2>
            <form method="POST" action="/api/volunteers/reset-password/${token}">
                <input type="password" name="newPassword" placeholder="Enter new password" required />
                <br/><br/>
                <button type="submit">Reset Password</button>
            </form>
        </body>
        </html>
    `);
});


// ================== RESET PASSWORD ==================
router.post('/reset-password/:token', upload, async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const data = resetTokens[token];

        if (!data || data.expires < Date.now()) {
            return res.send("<h2>Invalid or expired token ❌</h2>");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await Volunteer.findByIdAndUpdate(data.volunteerId, {
            password: hashedPassword
        });

        delete resetTokens[token];

        res.send("<h2>Password reset successful ✅</h2><p>You can now login.</p>");

    } catch (err) {
        res.send("<h2>Error resetting password ❌</h2>");
    }
});


// ================== UPDATE ==================
router.patch('/update/:id', upload, async (req, res) => {
    try {
        const result = await Volunteer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// ================== DELETE ==================
router.delete('/delete/:id', async (req, res) => {
    try {
        const result = await Volunteer.findByIdAndDelete(req.params.id);
        res.json({ message: `${result.name} deleted` });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// ================== GET BY ID ==================
router.get('/getVolunteerById/:id', async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        res.json(volunteer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ================== GET ALL ==================
router.get('/getAll', async (req, res) => {
    try {
        const volunteers = await Volunteer.find();
        res.json(volunteers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ================== TOGGLE ==================

router.patch('/toggle-status/:id', async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);

        volunteer.status = volunteer.status === "active" ? "blocked" : "active";

        await volunteer.save();

        res.json(volunteer);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;