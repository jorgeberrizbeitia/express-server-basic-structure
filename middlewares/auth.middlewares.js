const jwt = require("jsonwebtoken")

function verifyToken(req, res, next){
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ errorMessage: "No token provided" });
        }

        const token = req.headers.authorization.split(" ")[1]; // 👈 space here, inside the function

        const payload = jwt.verify(token, process.env.TOKEN_SECRET);
        
        req.payload = payload;
        
        next()
    } catch (error) {
       res.status(401).json({ errorMessage: "Token problem" });
    }
}

module.exports = verifyToken