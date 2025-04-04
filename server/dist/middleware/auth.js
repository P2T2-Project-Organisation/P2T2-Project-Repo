import jwt from 'jsonwebtoken';
// Middleware function to authenticate JWT token
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.sendStatus(401); // Unauthorized
    }
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY || '';
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        if (!user) {
            return res.sendStatus(403); // Ensure all paths return a response
        }
        req.user = user;
        return next(); // Proceed if everything is fine
    });
    return; // Ensures TypeScript knows all paths return
};
