const jwt = require ('jsonwebtoken');


// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from "Authorization: Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = verified; // Attach user details (from token payload) to the request object
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = authenticateToken;