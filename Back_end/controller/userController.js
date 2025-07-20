require('dotenv').config();
const express = require('express');
const router = express.Router();

const User = require('../model/User');
const multer = require('../middleware/multer');
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

// Home route
router.get('/', (req, res) => {
    res.send("This is Home Page of Pet REscue Department....!!!");
});

// Register pet
router.post('/registeruser', multer.single('image'), async (req, res) => {
    
    try {
        const { userid, name, password,contact, petType } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Image is required' });
        }

        const hash = await bcrypt.hash(password, 10);

        const newUser = new User({
            userid,
            name,
            password: hash,
            contact,
            image: req.file.filename,
            petType,
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login route
router.post('/login', async function (req, res) {
     try {
        const { userid, password} = req.body;
        
        if (!userid|| !password ) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ userid });
        console.log(user)
        if (!user) {
            return res.status(400).json({
                message: "Incorrect userid or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
       
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            name:user.name,
            userid: user.userid,
            contact: user.contact,
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.name}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
});

// Get Pet by id (using id)
router.get('/getPetsById/:id', async (req, res) => {
    try {
        const users = await User.find();

        const usersWithImageUrl = users.map(u => ({
            ...u._doc,
            image: `${req.protocol}://${req.get('host')}/uploads/${u.image}`,
        }));

        res.json(usersWithImageUrl);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Volunteers (for rescue the pets)
router.get('/getVolunteers', async (req, res) => {
    try {
        const users = await User.find();

        const usersWithImageUrl = users.map(u => ({
            ...u._doc,
            image: `${req.protocol}://${req.get('host')}/uploads/${u.image}`,
        }));

        res.json(usersWithImageUrl);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update info
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await User.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});



// Delete info
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await User.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});
//search_by_name/id
router.get('/filterByName/:name', async (req, res) => {
    try {
        const users = await User.find({name:{$regex:req.params.name,$options:"i"}});

        const usersWithImageUrl = users.map(u => ({
            ...u._doc,
            image: `${req.protocol}://${req.get('host')}/uploads/${u.image}`,
        }));

        res.json(usersWithImageUrl);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Pets (for getting all pets)
router.get('/getPets', async (req, res) => {
    try {
        const users = await User.find();

        const usersWithImageUrl = users.map(u => ({
            ...u._doc,
            image: `${req.protocol}://${req.get('host')}/uploads/${u.image}`,
        }));

        res.json(usersWithImageUrl);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
