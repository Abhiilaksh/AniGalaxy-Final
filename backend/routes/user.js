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
            { expiresIn: '24hr' }
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
            { expiresIn: '24h' }
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


const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach decoded token payload to the request
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid token" });
    }
};

// Route to mark an anime as favorite
router.post("/fav", authenticateToken, async (req, res) => {
    try {
        const { animeId } = req.body;
        if (!animeId) {
            return res.status(400).json({ error: "animeId is required" });
        }
        const userId = req.user.userID;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if anime is already in the favouriteAnime array
        if (user.favouriteAnime.includes(animeId)) {
            return res.status(200).json({
                message: "Anime is already in your favorites",
            });
        }

        // Use MongoDB's addToSet to ensure the animeId is unique
        user.favouriteAnime.addToSet(animeId);
        await user.save();

        return res.status(200).json({
            message: "Anime marked as favorite successfully",
        });
    } catch (error) {
        console.error("Error marking anime as favorite:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
router.get("/fav", authenticateToken, async (req, res) => {
    try {
     
      const userId = req.user.userID; 
      const user = await User.findById(userId);
      const animeId = req.query.id;
      console.log(animeId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
   
      const favourites = user.favouriteAnime;
      console.log(favourites);
      const isFavourite = favourites.some((fav) => fav === animeId);
  
      return res.status(200).json({  isFavourite });
    } catch (error) {
      console.error("Error fetching favourites:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  router.delete("/fav", authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userID;
      const user = await User.findById(userId);
      const animeId = req.body.animeId;
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const favourites = user.favouriteAnime;
      
      // Check if the anime is in the favourites array
      const isFavourite = favourites.includes(animeId);
      
      if (isFavourite) {
       
        user.favouriteAnime = favourites.filter((fav) => fav !== animeId);
        await user.save(); 
      }
  
      // Return the updated response
      return res.status(200).json({ isFavourite, favouriteAnime: user.favouriteAnime });
    } catch (error) {
      console.error("Error fetching favourites:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  router.get("/verify-token",authenticateToken,async(req,res)=>{
    res.status(200).json({ success: true, validToken: true });

  })

  router.get("/profile", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userID;
        if (!userId) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const user = await User.findById(userId).select("-password -__v");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.put("/profile", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userID; // Get user ID from the token
        const { firstName, username, email } = req.body; // Fields to potentially update

        // Find the user to update their profile
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Update fields if provided
        if (firstName) user.firstName = firstName;
        if (username) user.username = username;
        if (email) user.email = email;

        // Save the updated user
        await user.save();

        // Send the updated user data back to the client
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});


module.exports = router;
