import express from 'express';
import { User } from '../../models/index.js';
import { authenticateToken } from '../../middleware/auth.js';
const router = express.Router();
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const { id } = req.user;
        if (!id) {
            return res.status(400).json({ message: 'Invalid user data' });
        }
        const user = await User.findByPk(id, {
            attributes: ['username', 'email', 'createdAt'], // Include email and createdAt fields
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json(user); // Return the user data
    }
    catch (error) {
        console.error('Error fetching user data:', error.message);
        return res.status(500).json({ message: error.message });
    }
});
// GET /users - Get all users
router.get('/', async (_req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
        });
        return res.json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error.message);
        return res.status(500).json({ message: error.message });
    }
});
// GET /users/:id - Get a user by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] },
        });
        if (user) {
            return res.json(user);
        }
        else {
            return res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        console.error('Error fetching user by ID:', error.message);
        return res.status(500).json({ message: error.message });
    }
});
// POST /users - Create a new user
router.post('/', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const newUser = await User.create({ username, email, password });
        return res.status(201).json(newUser);
    }
    catch (error) {
        console.error('Error creating user:', error.message);
        return res.status(400).json({ message: error.message });
    }
});
// PUT /users/:id - Update a user by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
    try {
        const user = await User.findByPk(id);
        if (user) {
            user.username = username;
            user.password = password;
            await user.save();
            return res.json(user);
        }
        else {
            return res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        console.error('Error updating user:', error.message);
        return res.status(400).json({ message: error.message });
    }
});
// DELETE /users/:id - Delete a user by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
            return res.json({ message: 'User deleted' });
        }
        else {
            return res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        console.error('Error deleting user:', error.message);
        return res.status(500).json({ message: error.message });
    }
});
export { router as userRouter };
