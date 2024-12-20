const express = require('express');
const userRouter = require('./user');
const animeRouter=require('./anime')
const router = express.Router();

router.use("/user", userRouter);
router.use("/anime",animeRouter)

module.exports = router;