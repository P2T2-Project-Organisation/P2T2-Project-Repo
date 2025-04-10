import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';
// Define the User class extending Sequelize's Model
export class User extends Model {
    // Method to hash and set the password for the user
    async setPassword(password) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(password, saltRounds);
    }
    // Add a method to validate passwords
    async validatePassword(password) {
        return bcrypt.compare(password, this.password);
    }
}
// Define the UserFactory function to initialize the User model
export function UserFactory(sequelize) {
    User.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Ensure username is unique
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Ensure email is unique
            validate: {
                isEmail: true, // Validate email format
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'users', // Name of the table in PostgreSQL
        sequelize, // The Sequelize instance that connects to PostgreSQL
        hooks: {
            beforeCreate: async (user) => {
                if (!user.password.startsWith('$2b$')) { // Only hash if not already hashed
                    console.log('Hashing password before creating user:', user.username);
                    user.password = await bcrypt.hash(user.password, 10);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('password') && !user.password.startsWith('$2b$')) {
                    console.log('Hashing password before updating user:', user.username);
                    user.password = await bcrypt.hash(user.password, 10);
                }
            },
        }
    });
    return User; // Return the initialized User model
}
