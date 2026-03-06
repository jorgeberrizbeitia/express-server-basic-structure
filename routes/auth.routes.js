const router = require("express").Router();
const User = require("../User.model");

const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const verifyToken = require("../middlewares/auth.middlewares.js")

// sign up validation 

router.post("/signup", async (req, res, next) => {
    /*console.log(req.body);//debug purp*/
    const {email, password, name } = req.body;
    if (!email || !password || !name )//check if any field is missing or false
    { res.status(400).json({errorMessage:" 3 provide valid Information on all 3 fields" });
    return;
}
})