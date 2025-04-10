import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const forceDatabaseRefresh = false;
import dotenv from 'dotenv';
dotenv.config();
import express from 'express'; // Import types for Express
import sequelize from './config/connection.js';
import routes from './routes/index.js';
import cors from 'cors'; // Ensure this import is correct
// Emulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3001;
// Enable CORS for all routes
app.use(cors({
    origin: ['http://localhost:5173'], // Allow requests from the frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true, // Allow cookies to be sent with requests if needed
}));
// Add a debug route to check if the server is running
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'Server is running' });
});
// Ensure the uploads/images folder exists
const uploadsDir = path.resolve(__dirname, '../uploads/images');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Created directory: ${uploadsDir}`);
}
// Serve static files from the uploads/images directory
console.log(`Serving static files from: ${uploadsDir}`); // Log the uploads directory
app.use('/uploads/images', express.static(uploadsDir, {
    fallthrough: false, // Ensure 404 is returned if the file is not found
}));
// Serves static files in the entire client's dist folder
app.use(express.static(path.resolve(__dirname, '../../client/dist')));
app.use(express.json()); // Ensure JSON body parsing middleware is applied
app.use(express.urlencoded({ extended: true })); // Add URL-encoded body parsing
app.use(routes);
// Error handling for static file requests
app.use((err, _req, res, _next) => {
    console.error('Error serving static file:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
});
sequelize.sync({ force: forceDatabaseRefresh }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Error connecting to the database:', error.message, error.stack); // Log database connection errors
});
