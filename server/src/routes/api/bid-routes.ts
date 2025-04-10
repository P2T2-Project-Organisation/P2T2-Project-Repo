import { Router, Request, Response } from 'express';
import { Bid, Artwork, User } from '../../models/index.js';
import { authenticateToken } from '../../middleware/auth.js';
import { Op } from 'sequelize'; // Add this import for the Sequelize operators

const router = Router();

// Submit a new bid
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { artworkId, amount } = req.body;
    const userId = req.user?.id;

    if (!artworkId || !amount) {
      return res.status(400).json({ message: 'Artwork ID and bid amount are required' });
    }

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User information is missing' });
    }

    // Find the artwork to verify it exists
    const artwork = await Artwork.findByPk(artworkId);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // Don't allow users to bid on their own artwork
    if (artwork.userId === userId) {
      return res.status(400).json({ message: 'You cannot bid on your own artwork' });
    }

    // Create the new bid
    const bid = await Bid.create({
      artworkId,
      userId,
      amount,
      status: 'pending'
    });

    return res.status(201).json(bid);
  } catch (error) {
    console.error('Error creating bid:', error instanceof Error ? error.message : error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get bids received on the user's artworks
router.get('/received', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: User information is missing' });
    }

    // Find all artworks belonging to the user
    const userArtworks = await Artwork.findAll({
      where: { userId: req.user.id }
    });

    if (userArtworks.length === 0) {
      return res.json([]);
    }

    // Get all artworkIds
    const artworkIds = userArtworks.map(artwork => artwork.id);

    // Find all pending bids for the user's artworks
    const bids = await Bid.findAll({
      where: { 
        artworkId: artworkIds,
        status: 'pending'
      },
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Artwork,
          attributes: ['id', 'title', 'description', 'price', 'imagePath'],
        },
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.json(bids);
  } catch (error) {
    console.error('Error fetching received bids:', error instanceof Error ? error.message : error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Accept a bid
router.put('/:id/accept', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User information is missing' });
    }

    // Find the bid
    const bid = await Bid.findByPk(id, {
      include: [{ model: Artwork }]
    });

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Get the associated Artwork
    const artwork = await Artwork.findByPk(bid.artworkId);
    
    if (!artwork) {
      return res.status(404).json({ message: 'Associated artwork not found' });
    }

    // Verify the user owns the artwork
    if (artwork.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You do not own this artwork' });
    }

    // Update the bid to accepted
    bid.status = 'accepted';
    await bid.save();

    // Mark all other bids for this artwork as rejected
    await Bid.update(
      { status: 'rejected' },
      { 
        where: { 
          artworkId: bid.artworkId,
          id: { [Op.ne]: bid.id },  // Not equal to the current bid
          status: 'pending' 
        } 
      }
    );

    return res.json({ message: 'Bid accepted successfully' });
  } catch (error) {
    console.error('Error accepting bid:', error instanceof Error ? error.message : error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Reject a bid
router.put('/:id/reject', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User information is missing' });
    }

    // Find the bid
    const bid = await Bid.findByPk(id, {
      include: [{ model: Artwork }]
    });

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Get the associated Artwork
    const artwork = await Artwork.findByPk(bid.artworkId);
    
    if (!artwork) {
      return res.status(404).json({ message: 'Associated artwork not found' });
    }

    // Verify the user owns the artwork
    if (artwork.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You do not own this artwork' });
    }

    // Update the bid to rejected
    bid.status = 'rejected';
    await bid.save();

    return res.json({ message: 'Bid rejected successfully' });
  } catch (error) {
    console.error('Error rejecting bid:', error instanceof Error ? error.message : error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new endpoint to get the count of bids for the current user
router.get('/count', authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Count bids where the current user is the recipient
    const count = await Bid.count({
      where: { userId: req.user.id }
    });

    return res.json({ count });
  } catch (error) {
    console.error('Error fetching bid count:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
