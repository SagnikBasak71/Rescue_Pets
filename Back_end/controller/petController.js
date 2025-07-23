const express = require('express');
const router = express.Router();
const Pet = require('../model/Pet');
const multer = require('../middleware/multer');

// Upload new pet (rescue report)
router.post('/upload', multer.single('image'), async (req, res) => {
    try {
        const { pet_type, description, address, status } = req.body;

        if (!req.file) return res.status(400).json({ message: 'Image is required' });

        const newPet = new Pet({
            pet_type,
            description,
            upload_date_time: new Date(),
            address,
            status,
            image: req.file.filename
        });

        const saved = await newPet.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update pet info
router.patch('/update/:id', async (req, res) => {
    try {
        const updated = await Pet.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: 'Pet not found' });
        res.json(updated);
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

// Get one pet by ID
router.get('/get/:id', async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) return res.status(404).json({ message: 'Pet not found' });

        pet.image = `${req.protocol}://${req.get('host')}/uploads/${pet.image}`;
        res.json(pet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all pets
router.get('/getall', async (req, res) => {
    try {
        const pets = await Pet.find();
        const petsWithImage = pets.map(p => ({
            ...p._doc,
            image: `${req.protocol}://${req.get('host')}/uploads/${p.image}`,
        }));
        res.json(petsWithImage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search by location
router.get('/searchByLocation/:address', async (req, res) => {
    try {
        const pets = await Pet.find({ address: { $regex: req.params.address, $options: 'i' } });
        const petsWithImage = pets.map(p => ({
            ...p._doc,
            image: `${req.protocol}://${req.get('host')}/uploads/${p.image}`,
        }));
        res.json(petsWithImage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
