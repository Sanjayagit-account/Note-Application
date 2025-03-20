const express = require('express');
const authenticateToken = require('../middleware/auth');
const { signup, login ,logout ,getUser} = require('../controller/user.controller');

const router = express.Router();

// Routes
router.post("/signup",signup); 
router.post("/login", login);
router.get("/getUser",authenticateToken,getUser)
router.get("/logout",authenticateToken,logout)

module.exports = router;

