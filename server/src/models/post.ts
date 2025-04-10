import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import { User } from './user.js';

interface PostAttributes {
  id: number;
  title: string;
  content: string;
  imagePath?: string; // Mark imagePath as optional with '?'
  userId: number;
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id'> {}

export class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: number;
  public title!: string;
  public content!: string;
  public imagePath?: string; // Mark imagePath as optional with '?'
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function PostFactory(sequelize: Sequelize): typeof Post {
  Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      imagePath: {
        type: DataTypes.STRING,
        allowNull: true, // Allow NULL values for imagePath
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: 'id',
        },
      },
    },
    {
      tableName: 'posts',
      sequelize,
    }
  );

  return Post;
}
