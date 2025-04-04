import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

// Define the API endpoint that fetches artwork data
app.get('/api/artwork', async (_req, res) => {
  try {
    const response = await axios.post('https://api.artic.edu/api/v1/search', {
      resources: 'artworks',
      fields: ['id', 'title', 'artist_title', 'image_id', 'date_display', 'thumbnail'],
      limit: 1, // Fetch one artwork for simplicity
      query: {
        function_score: {
          query: {
            bool: {
              filter: [
                { term: { is_public_domain: true } },
                { exists: { field: 'image_id' } },
                { exists: { field: 'thumbnail.width' } },
                { exists: { field: 'thumbnail.height' } },
              ],
            },
          },
          boost_mode: 'replace',
          random_score: { field: 'id', seed: Date.now() },
        },
      },
    });

    // Send the data to the frontend
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching artwork data:', error);
    res.status(500).send('Error fetching artwork data');
  }
});

// Serve static files (for example, your React build files)
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
