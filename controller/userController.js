require('dotenv').config();
const express = require('express');
const router = express.Router();

const User = require('../model/User');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const multer = require('../middleware/multer');
const upload = multer.none();

// 🔥 TEMP TOKEN STORAGE
const resetTokens = {};


// ================== HOME ==================
router.get('/', (req, res) => {
    res.send("Welcome to the Pet Rescue User Portal!");
});


// ================== REGISTER ==================
router.post('/register', upload, async (req, res) => {
    try {
        const { name, email, password, contact, location } = req.body;

        if (!name || !email || !password || !contact || !location) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            contact,
            location
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// ================== LOGIN ==================
// ================== LOGIN ==================
router.post('/login', upload, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing email or password"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // ✅ compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 🔥 CREATE TOKEN (UPDATED)
        const token = jwt.sign(
            {
                id: user._id,
                role: "user"   // ✅ important for future role-based logic
            },
            process.env.SECRET_KEY,
            { expiresIn: "3d" }  // ✅ stays logged in for 3 days
        );

        res.status(200).json({
            success: true,
            message: `Welcome back ${user.name}`,
            token: token,
            role: "user",   // ✅ send role to frontend
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// ================== GET USER PROFILE ==================
router.get('/profile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json(user);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ================== UPDATE USER PROFILE ==================
router.put('/update-profile/:id', upload, async (req, res) => {
    try {
        const { email, contact, location } = req.body;

        if (!email || !contact || !location) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // 🔥 prevent duplicate email
        const existing = await User.findOne({ email });
        if (existing && existing._id.toString() !== req.params.id) {
            return res.status(400).json({
                success: false,
                message: "Email already in use"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { email, contact, location },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
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

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const token = crypto.randomBytes(32).toString('hex');

        resetTokens[token] = {
            userId: user._id,
            expires: Date.now() + 10 * 60 * 1000
        };

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });

        const resetLink = `http://192.168.0.101:4000/api/users/reset-password/${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset",
            text: resetLink
        });

        res.json({
            success: true,
            message: "Reset link sent"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ================== RESET PAGE ==================
router.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;

    res.send(`
        <h2>Reset Password</h2>
        <form method="POST" action="/api/users/reset-password/${token}">
            <input type="password" name="newPassword" placeholder="New Password" required />
            <br/><br/>
            <button>Reset</button>
        </form>
    `);
});


// ================== RESET PASSWORD ==================
router.post('/reset-password/:token', upload, async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const data = resetTokens[token];

        if (!data || data.expires < Date.now()) {
            return res.send("Invalid token");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(data.userId, {
            password: hashedPassword
        });

        delete resetTokens[token];

        res.send("Password updated");

    } catch {
        res.send("Error");
    }
});


// ================== EXPORT ==================
module.exports = router;