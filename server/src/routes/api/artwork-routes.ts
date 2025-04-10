import { Router, Request, Response } from 'express';
import multer from 'multer';
import { Artwork, User } from '../../models/index.js';
import { authenticateToken } from '../../middleware/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Emulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Configure multer to save files in the "uploads/images" folder
const upload = multer({
  dest: path.resolve(__dirname, '../../../uploads/images'), // Use path.resolve for clarity
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

router.post(
  '/list',
  authenticateToken as any, // Explicitly cast to `any` to bypass type-checking issues
  upload.single('image') as any, // Explicitly cast to `any` to bypass type-checking issues
  async (req: Request, res: Response) => {
    try {
      const { title, artist, year, description, dimensions, price, category } = req.body;
      const imagePath = req.file?.path;

      // Validate required fields
      if (!title || !description || !price || !category) {
        return res.status(400).json({ message: 'Title, description, price, and category are required' });
      }

      if (!imagePath) {
        return res.status(400).json({ message: 'Image is required' });
      }

      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized: User information is missing' });
      }

      // Validate price
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice <= 0 || parsedPrice > 1000000) {
        return res.status(400).json({ message: 'Price must be a number between 1 and 1,000,000' });
      }

      const artwork = await Artwork.create({
        title,
        artist,
        year,
        description,
        dimensions,
        price: parsedPrice,
        category,
        imagePath: path.basename(imagePath), // Save only the filename
        userId: req.user.id,
      });

      return res.status(201).json(artwork);
    } catch (error) {
      console.error('Error creating artwork:', error instanceof Error ? error.message : error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
);

router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: User information is missing' });
    }

    const { userOnly } = req.query; // Check if the request is for the logged-in user's listings

    const whereClause = userOnly === 'true' ? { userId: req.user.id } : {}; // Filter by userId if userOnly is true

    const artworks = await Artwork.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['username'], // Include only the username from the User table
        },
      ],
    });

    // Add the full URL for the image path
    const artworksWithFullImagePath = artworks.map((artwork) => ({
      ...artwork.toJSON(),
      imagePath: `${req.protocol}://${req.get('host')}/uploads/images/${artwork.imagePath}`,
    }));

    return res.json(artworksWithFullImagePath);
  } catch (error) {
    console.error('Error fetching artworks:', error instanceof Error ? error.message : error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const artwork = await Artwork.findByPk(id);

    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    return res.json(artwork);
  } catch (error) {
    console.error('Error fetching artwork by ID:', error instanceof Error ? error.message : error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, upload.single('image') as any, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category } = req.body;
    const imagePath = req.file?.path;

    const artwork = await Artwork.findByPk(id);

    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    if (artwork.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized to edit this listing' });
    }

    artwork.title = title || artwork.title;
    artwork.description = description || artwork.description;
    artwork.price = price || artwork.price;
    artwork.category = category || artwork.category;
    if (imagePath) {
      artwork.imagePath = path.basename(imagePath);
    }

    await artwork.save();
    return res.json(artwork);
  } catch (error) {
    console.error('Error updating artwork:', error instanceof Error ? error.message : error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: User information is missing' });
    }

    const artwork = await Artwork.findByPk(id);

    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    if (artwork.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this listing' });
    }

    await artwork.destroy();
    return res.status(200).json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    console.error('Error deleting artwork:', error instanceof Error ? error.message : error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
