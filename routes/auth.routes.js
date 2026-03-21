const router = require("express").Router();
const User = require("../models/User.model");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/auth.middlewares.js");

// sign up validation

router.post("/signup", async (req, res, next) => {
  /*console.log(req.body);//debug purp*/
  const { email, password, name } = req.body;

  if (!email || !password || !name) //check if any field is missing or false
  {
    return res
      .status(400)
      .json({ errorMessage: " 3 provide valid Information on all 3 fields" });
  }
  //pasword regex validation
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

  if (!passwordRegex.test(password)) {
    return res
      .status(400)
      .json({
        errorMessage:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
  }

  try {
    const foundUser = await User.findOne({ email });

    if (foundUser) {
      return res.status(400).json({ errorMessage: "Email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      email: email,
      password: hashPassword,
      name: name,
    });
    res
      .status(201)
      .json({
        message: "User created successfully",
        user: { _id: newUser._id, email: newUser.email, name: newUser.name },
      });
  } catch (error) {
    next(error);
  }
});
//just to recommit 
// LOGIN
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ errorMessage: "Email and password are required" });
  }

  try {
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(400).json({ errorMessage: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password,
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ errorMessage: "Wrong password" });
    }

    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
      name: foundUser.name,
    };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      authToken,
      user: payload,
    });
  } catch (error) {
    next(error);
  }
});

// LOGOUT
router.post("/logout", (req, res, next) => {
  res.status(200).json({ message: "Logged out successfully" });
});

// VERIFY
router.get("/verify", verifyToken, (req, res, next) => {
  res.status(200).json({ payload: req.payload });
});

module.exports = router;
