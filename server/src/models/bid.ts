import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import { User } from './user.js';
import { Artwork } from './artwork.js';

interface BidAttributes {
  id: number;
  artworkId: number;
  userId: number;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected';
}

interface BidCreationAttributes extends Optional<BidAttributes, 'id'> {}

export class Bid extends Model<BidAttributes, BidCreationAttributes> implements BidAttributes {
  public id!: number;
  public artworkId!: number;
  public userId!: number;
  public amount!: number;
  public status!: 'pending' | 'accepted' | 'rejected';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function BidFactory(sequelize: Sequelize): typeof Bid {
  Bid.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      artworkId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Artwork,
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: 'id',
        },
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending',
        allowNull: false,
      },
    },
    {
      tableName: 'bids',
      sequelize,
    }
  );

  return Bid;
}
