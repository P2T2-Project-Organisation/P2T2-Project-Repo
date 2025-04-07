import { User } from '../models/index.js';
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing
export const seedUsers = async () => {
    const hashedPassword = await bcrypt.hash('password', 10); // Hash the password once
    await User.bulkCreate([
        {
            username: 'JollyGuru',
            email: 'jolly@guru.com',
            password: hashedPassword, // Use the pre-hashed password
        },
        {
            username: 'SunnyScribe',
            email: 'sunny@scribe.com',
            password: hashedPassword, // Use the pre-hashed password
        },
        {
            username: 'RadiantComet',
            email: 'radiant@comet.com',
            password: hashedPassword, // Use the pre-hashed password
        },
    ], { individualHooks: true });
};
