import sequelize from '../config/connection.js';
import { UserFactory } from './user.js';
import { ArtworkFactory } from './artwork.js';
import { PostFactory } from './post.js';
import { BidFactory } from './bid.js';

const User = UserFactory(sequelize);
const Artwork = ArtworkFactory(sequelize);
const Post = PostFactory(sequelize);
const Bid = BidFactory(sequelize);

User.hasMany(Artwork, { foreignKey: 'userId', onDelete: 'CASCADE' });
Artwork.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Bid, { foreignKey: 'userId', onDelete: 'CASCADE' });
Bid.belongsTo(User, { foreignKey: 'userId' });

Artwork.hasMany(Bid, { foreignKey: 'artworkId', onDelete: 'CASCADE' });
Bid.belongsTo(Artwork, { foreignKey: 'artworkId' });

export { User, Artwork, Post, Bid };
