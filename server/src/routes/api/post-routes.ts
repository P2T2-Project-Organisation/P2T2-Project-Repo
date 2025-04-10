import { Router, Request, Response } from 'express';
import multer from 'multer';
import { Post, User } from '../../models/index.js';
import { authenticateToken } from '../../middleware/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Emulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Configure multer to save files in the "uploads/images" folder
const upload = multer({
  dest: path.resolve(__dirname, '../../../uploads/images'),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

// Get all posts
router.get('/', authenticateToken, async (_req: Request, res: Response) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
      order: [['createdAt', 'DESC']], // Most recent first
    });

    // Add the full URL for the image path
    const postsWithFullImagePath = posts.map((post) => ({
      ...post.toJSON(),
      imagePath: post.imagePath 
        ? `${_req.protocol}://${_req.get('host')}/uploads/images/${post.imagePath.split('/').pop()}`
        : null,
    }));

    return res.json(postsWithFullImagePath);
  } catch (error) {
    console.error('Error fetching posts:', error instanceof Error ? error.message : error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new post
router.post(
  '/',
  authenticateToken,
  upload.single('image') as any,
  async (req: Request, res: Response) => {
    try {
      const { title, content } = req.body;
      const imagePath = req.file?.path;

      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized: User information is missing' });
      }

      // Validate required fields
      if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
      }

      const postData: any = {
        title,
        content,
        userId: req.user.id,
      };

      // Only add imagePath if file was uploaded
      if (imagePath) {
        postData.imagePath = path.basename(imagePath);
      }

      const post = await Post.create(postData);

      return res.status(201).json(post);
    } catch (error) {
      console.error('Error creating post:', error instanceof Error ? error.message : error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Get a single post
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id, {
      include: [{ model: User, attributes: ['username'] }],
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.json(post);
  } catch (error) {
    console.error('Error fetching post by ID:', error instanceof Error ? error.message : error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a post
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: User information is missing' });
    }

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }

    await post.destroy();
    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error instanceof Error ? error.message : error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
