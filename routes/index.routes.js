const express = require("express");

const router = express.Router();

// ℹ️ Organize and connect all your route files here.

// auth routes :
const authRoute = require("./auth.routes");
router.use("/auth", authRoute);

/* 
POST /api/auth/signup



POST /api/auth/login




POST /api/auth/logout




GET /api/users/verify


*/

//card routes:
const cardRoute = require("./card.routes");
router.use("/", cardRoute);

//Deck routes:
const deckRoute = require("./deck.routes");
router.use("/", deckRoute);
// collection routes :

module.exports = router;
