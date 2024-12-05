const express = require('express');
const router = express.Router();
const zod = require("zod");

const { User } = require("../db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "AnigalaxybyAbhilaksh";

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
});

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            msg: "incorrect inputs"
        });
    }

    const existingUser = await User.findOne({
        username: req.body.username
    });

    if (existingUser) {
        return res.status(411).json({
            msg: "Email already taken"
        });
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });

    const userID = user._id;

    const token = jwt.sign({
        userID
    }, JWT_SECRET);

    res.json({
        message: "User Created Successfully",
        token: token
    });
});

// signin
const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            msg: "Incorrect Inputs"
        });
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userID: user._id
        }, JWT_SECRET);
        res.json({
            msg:`Welcome ${req.body.username}`,
            token: token
        });
        return;
    }
    res.status(411).json({
        msg: "Error while logging in"
    });
});

module.exports = router;