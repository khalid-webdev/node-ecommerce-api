const jwt = require('jsonwebtoken');
require('dotenv').config({quiet:true});

const authMiddleware = (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;

    // Check if the header is present and in the correct 'Bearer <token>' format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Get the token part
    const token = authHeader.split(' ')[1];
    try {
        // Verify the token using the secret key
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user payload to the request object
        req.user = decodedUser;

        // Call next() to pass control to the next handler
        next();
    } catch (err) {
        // Handle invalid or expired tokens
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
