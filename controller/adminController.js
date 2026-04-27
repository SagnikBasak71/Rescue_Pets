require('dotenv').config();
const express = require('express');
const router = express.Router();

const Admin = require('../model/Admin');
const Volunteer = require('../model/Volunteer'); // 🔥 ADDED
const Pet = require('../model/Pet'); // 🔥 FIXED (Report = Pet)

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('../middleware/multer');

// 🔥 TOKEN STORAGE
const resetTokens = {};

// ================= 🔐 AUTH =================
const adminAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "No token" });
        }

        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({ message: "Invalid token format" });
        }

        const token = parts[1];

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        req.adminId = decoded.adminId;

        next();

    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// ================= LOGIN =================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { adminId: admin._id },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            admin
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= CREATE ADMIN =================
router.post('/create-admin', adminAuth, multer.single('image'), async (req, res) => {
    try {
        const { email, name, password, contact, address } = req.body;
        const image = req.file?.filename || "default.png";

        const existing = await Admin.findOne({ email });
        if (existing) return res.status(400).json({ message: "Admin exists" });

        const hashed = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            email,
            name,
            password: hashed,
            contact,
            address,
            image
        });

        await newAdmin.save();

        res.json({ success: true, message: "Admin created" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= FORGOT PASSWORD =================
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const token = crypto.randomBytes(32).toString('hex');

        resetTokens[token] = {
            adminId: admin._id,
            expires: Date.now() + 10 * 60 * 1000
        };

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });

        const link = `http://192.168.0.101:4000/api/admins/reset-password/${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Reset Password",
            text: link
        });

        res.json({ message: "Reset link sent" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= RESET PAGE =================
router.get('/reset-password/:token', (req, res) => {
    const token = req.params.token;

    res.send(`
        <h2>Reset Password</h2>
        <form method="POST" action="/api/admins/reset-password/${token}">
            <input type="password" name="newPassword" placeholder="New Password" required />
            <br><br>
            <button>Reset</button>
        </form>
    `);
});

// ================= RESET PASSWORD =================
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const data = resetTokens[token];
        if (!data || data.expires < Date.now()) {
            return res.send("Invalid token");
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        await Admin.findByIdAndUpdate(data.adminId, { password: hashed });

        delete resetTokens[token];

        res.send("Password updated");

    } catch {
        res.send("Error");
    }
});

// ================= DELETE REPORT (PET) =================
router.delete('/delete-report/:id', adminAuth, async (req, res) => {
    try {
        await Pet.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Report deleted by admin"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= 🔥 GET ALL VOLUNTEERS =================
router.get('/all-volunteers', adminAuth, async (req, res) => {
    try {

        const volunteers = await Volunteer.find();

        res.json({
            status: true,
            volunteers: volunteers
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
});



module.exports = router;