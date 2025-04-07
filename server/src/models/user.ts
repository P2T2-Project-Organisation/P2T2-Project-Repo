import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import bcrypt from 'bcrypt';

// Define the attributes for the User model
interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
}

// Define the optional attributes for creating a new User
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Define the User class extending Sequelize's Model
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method to hash and set the password for the user
  public async setPassword(password: string) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(password, saltRounds);
  }

  // Add a method to validate passwords
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

// Define the UserFactory function to initialize the User model
export function UserFactory(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure email is unique
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'users',  // Name of the table in PostgreSQL
      sequelize,            // The Sequelize instance that connects to PostgreSQL
      hooks: {
        beforeCreate: async (user: User) => {
          if (!user.password.startsWith('$2b$')) { // Only hash if not already hashed
            console.log('Hashing password before creating user:', user.username);
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user: User) => {
          if (user.changed('password') && !user.password.startsWith('$2b$')) {
            console.log('Hashing password before updating user:', user.username);
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      }
    }
  );

  return User;  // Return the initialized User model
}
