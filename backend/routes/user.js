const express = require('express');
const router = express.Router();
const zod = require('zod');
const bcrypt = require('bcryptjs'); // Use bcryptjs for hashing
const jwt = require('jsonwebtoken');
const { User } = require('../db');


const JWT_SECRET =  "AnigalaxybyAbhilaksh"; // Use an env variable for JWT_SECRET

// Validation Schemas
const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string().min(1, "First name is required"),
    lastName: zod.string().min(1, "Last name is required"),
    password: zod.string().min(6, "Password must be at least 6 characters long")
});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6, "Password must be at least 6 characters long")
});

// Signup Route
router.post('/signup', async (req, res) => {
    const validation = signupBody.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            msg: 'Invalid inputs',
            errors: validation.error.errors
        });
    }

    const { username, firstName, lastName, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                msg: 'Email already taken'
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword);

        // Create the user
        const user = await User.create({
            username,
            firstName,
            lastName,
            password: hashedPassword
        });
        console.log('Saved User:', user);

        // Generate a token
        const token = jwt.sign(
            { userID: user._id, name: user.firstName },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            msg: 'User created successfully',
            token
        });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
});

// Signin Route
router.post('/signin', async (req, res) => {
    const validation = signinBody.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            msg: 'Invalid inputs',
            errors: validation.error.errors
        });
    }

    const { username, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                msg: 'Invalid email'
            });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                msg: 'Invalid password'
            });
        }

        // Generate a token
        const token = jwt.sign(
            { userID: user._id, name: user.firstName },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        res.json({
            msg: `Welcome ${user.firstName}`,
            token
        });
    } catch (err) {
        console.error('Signin Error:', err);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
});

module.exports = router;
