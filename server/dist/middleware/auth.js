import jwt from 'jsonwebtoken';
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.error('Authorization header missing');
        return res.status(401).json({ message: 'Authorization header missing' }); // Unauthorized
    }
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY || '';
    if (!secretKey) {
        console.error('JWT_SECRET_KEY is not defined in environment variables');
        return res.status(500).json({ message: 'Internal server error: Missing JWT secret key' });
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.error('JWT verification failed:', err.message);
            return res.status(403).json({ message: 'Invalid or expired token' }); // Forbidden
        }
        if (!user) {
            console.error('JWT verification returned no user');
            return res.status(403).json({ message: 'Invalid token payload' }); // Forbidden
        }
        req.user = user;
        console.log('JWT verified successfully:', user);
        next(); // Proceed if everything is fine
        return; // Explicitly return after calling next()
    });
    return; // Ensure a return statement exists at the end of the function
};
