const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    if (req.path.startsWith('/auth')) return next();

    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Failed to authenticate token' });
        req.userId = decoded.id;
        next();
    });
};

module.exports = authMiddleware;
