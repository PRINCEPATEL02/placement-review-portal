const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        // Bearer token handling
        const tokenString = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

        const verified = jwt.verify(tokenString, process.env.JWT_SECRET || 'secret');
        req.user = verified;
        next();
    } catch (err) {
        console.error("Token Verification Error:", err.message);
        res.status(400).json({ message: 'Invalid token' });
    }
};

exports.verifyAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        const currentRole = req.user ? req.user.role : 'unknown';
        console.warn(`Access denied: User ${req.user ? req.user.enrollment : 'Unknown'} with role ${currentRole} tried to access admin route.`);
        return res.status(403).json({ message: `Access denied. Administrator privileges required. Current role: ${currentRole}` });
    }
    next();
};
