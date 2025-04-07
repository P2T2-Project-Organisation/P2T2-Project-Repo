import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('your-publishable-key-here'); // Replace with your Stripe publishable key

interface ArtworkDetails {
  id: number;
  title: string;
  artist_title: string;
  date_display: string;
  place_of_origin: string;
  description: string;
  dimensions: string;
  department_title: string;
  image_id: string;
  price: string;
}

const ProductViewer = () => {
  const { id } = useParams<{ id: string }>();
  const [artwork, setArtwork] = useState<ArtworkDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworkDetails = async () => {
      try {
        const response = await fetch(`https://api.artic.edu/api/v1/artworks/${id}`);
        const data = await response.json();
        const artworkData = data.data;

        // Add a random price for the artwork and format it with commas
        const randomPrice = `$${(Math.random() * 7000000 + 100).toLocaleString()}`;

        setArtwork({
          id: artworkData.id,
          title: artworkData.title,
          artist_title: artworkData.artist_title || 'Unknown Artist',
          date_display: artworkData.date_display || 'Unknown Year',
          place_of_origin: artworkData.place_of_origin || 'Unknown Location',
          description: artworkData.thumbnail?.alt_text || 'No description available.',
          dimensions: artworkData.dimensions || 'Unknown Dimensions',
          department_title: artworkData.department_title || 'Unknown Category',
          image_id: artworkData.image_id,
          price: randomPrice,
        });
      } catch (error) {
        console.error('Error fetching artwork details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworkDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!artwork) {
    return <div>Artwork not found.</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Artwork Image */}
        <div className="col-md-8">
          <img
            src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
            alt={artwork.title}
            className="img-fluid"
            style={{ borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
          />
        </div>

        {/* Artwork Details */}
        <div className="col-md-4">
          <h2>{artwork.title}</h2>
          <p>
            <strong>Artist:</strong> {artwork.artist_title}
          </p>
          <p>
            <strong>Year:</strong> {artwork.date_display}
          </p>
          <p>
            <strong>Place of Display:</strong> {artwork.place_of_origin}
          </p>
          <p>
            <strong>Description:</strong> {artwork.description}
          </p>
          <p>
            <strong>Dimensions:</strong> {artwork.dimensions}
          </p>
          <p>
            <strong>Category:</strong> {artwork.department_title}
          </p>
          <p
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'green',
            }}
          >
            {artwork.price}
          </p>
          <Elements stripe={stripePromise}>
            <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px', maxWidth: '500px', margin: '20px auto' }}>
              <CheckoutForm amount={parseInt(artwork.price.replace(/[$,]/g, '')) * 100} />
            </div>
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default ProductViewer;