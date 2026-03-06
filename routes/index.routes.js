const express = require("express");

const router =  express.Router()



// ℹ️ Organize and connect all your route files here.
// auth routes :
const authRoute = require("./auth.routes")
router.use("/auth",authRoute)

/* 
POST /api/auth/signup



POST /api/auth/login




POST /api/auth/logout




GET /api/users/me


*/

//card routes:
//Deck routes:
// collection routes : 






module.exports = router;
