const express = require("express");
const router = express.Router();
const { 
    authRegister,
    authLogin
 } = require("../controllers/authController")

 router.post("/auth/register", authRegister)
 router.post("/auth/login", authLogin)

module.exports = router;