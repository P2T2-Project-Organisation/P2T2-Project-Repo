import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import { User } from './user.js';

interface ArtworkAttributes {
  id: number;
  title: string;
  artist?: string;
  year?: string;
  description: string;
  dimensions?: string;
  price: number;
  category: string;
  imagePath: string;
  userId: number;
}

interface ArtworkCreationAttributes extends Optional<ArtworkAttributes, 'id'> {}

export class Artwork extends Model<ArtworkAttributes, ArtworkCreationAttributes> implements ArtworkAttributes {
  public id!: number;
  public title!: string;
  public artist?: string;
  public year?: string;
  public description!: string;
  public dimensions?: string;
  public price!: number;
  public category!: string;
  public imagePath!: string;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function ArtworkFactory(sequelize: Sequelize): typeof Artwork {
  Artwork.init(
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
      artist: {
        type: DataTypes.STRING,
      },
      year: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      dimensions: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          max: 1000000,
        },
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imagePath: {
        type: DataTypes.STRING,
        allowNull: false,
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
      tableName: 'artworks',
      sequelize,
    }
  );

  return Artwork;
}
