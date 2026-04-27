const express = require('express');
const router = express.Router();
const Pet = require('../model/Pet');
const multer = require('../middleware/multer');
const sendNotificationToAll = require("../utils/sendNotification");

// 🔥 PUT YOUR PC IP HERE
const BASE_URL = "http://192.168.0.101:4000";

// Upload new pet (rescue report)
router.post('/upload', multer.single('image'), async (req, res) => {
    try {
        // 🔥 ADD LAT & LNG HERE
        const { pet_type, description, address, latitude, longitude } = req.body;

        // ❗ validation (important)
        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Location required" });
        }

        const newPet = new Pet({
            pet_type,
            description,
            upload_date_time: new Date(),
            address,
            status: 'pending',
            image: req.file.filename,

            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
});

        const saved = await newPet.save();

        await sendNotificationToAll();

        res.status(201).json({
            message: "Pet uploaded & notification sent",
            pet: saved
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Update pet info
router.patch('/update/:id', async (req, res) => {
    try {

        const { status, userId } = req.body;

        const pet = await Pet.findById(req.params.id);

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // 🔒 LOCK CHECK
        if (pet.status === "accepted") {
            return res.status(400).json({
                message: "Already accepted by another volunteer"
            });
        }

        // ✅ ACCEPT
        if (status === "accepted") {
            pet.status = "accepted";
            pet.assignedTo = userId; // 🔥 assign volunteer
        }

        await pet.save();

        res.json({
            message: "Accepted successfully",
            pet
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Delete pet
router.delete('/delete/:id', async (req, res) => {
    try {
        const pet = await Pet.findByIdAndDelete(req.params.id);

        if (!pet) return res.status(404).json({ message: 'Pet not found' });

        res.json({ message: `Deleted pet: ${pet.pet_type}` });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Get one pet
router.get('/get/:id', async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        if (!pet) return res.status(404).json({ message: 'Pet not found' });

        pet.image = `${BASE_URL}/Uploads/${pet.image}`;

        res.json(pet);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Get all pets (FILTERED)
router.get('/getall/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const pets = await Pet.find({
            status: "pending",                 // ✔ only pending
            rejectedBy: { $ne: userId }        // ✔ not rejected by this user
        });

        const petsWithImage = pets.map(p => ({
            ...p._doc,
            image: `${BASE_URL}/Uploads/${p.image}`,
        }));

        res.json({
            status: true,
            pets: petsWithImage,
            message: "success"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
            status: false
        });
    }
});


// Search by address
router.get('/searchByLocation/:address', async (req, res) => {
    try {
        const pets = await Pet.find({
            address: { $regex: req.params.address, $options: 'i' }
        });

        const petsWithImage = pets.map(p => ({
            ...p._doc,
            image: `${BASE_URL}/Uploads/${p.image}`,
        }));

        res.json(petsWithImage);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Reject
router.patch('/reject/:id', async (req, res) => {
    try {
        const userId = req.body.userId; // 🔥 get from frontend

        const updated = await Pet.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { rejectedBy: userId } // 🔥 avoid duplicates
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        res.json({ message: "Rejected successfully", pet: updated });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;