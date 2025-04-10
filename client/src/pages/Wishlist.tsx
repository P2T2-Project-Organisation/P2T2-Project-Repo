import { useEffect, useState } from "react";
import { Artwork } from "../interfaces/ArtInterface"; // Use named export for Artwork
import { useLocation } from "react-router-dom";

const Wishlist = () => {
  const location = useLocation();
  const [wishlist, setWishlist] = useState<Artwork[]>([]);

  useEffect(() => {
    const stateWishlist: Artwork[] = location.state?.wishlist || [];
    const storedWishlist = localStorage.getItem("wishlist");
    if (stateWishlist.length > 0) {
      setWishlist(stateWishlist);
    } else if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist)); // Load from localStorage
    }
  }, [location.state]);

  const handleRemoveFromWishlist = (artworkId: number) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== artworkId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist)); // Update localStorage
  };

  // Helper function to determine the correct image source
  const getImageSrc = (artwork: Artwork): string => {
    // If the artwork has an imagePath (auction artwork), use that directly
    if (artwork.imagePath) {
      return artwork.imagePath;
    }
    
    // If the artwork has an image_id (explore artwork), use the Art Institute API
    if (artwork.image_id) {
      return `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`;
    }
    
    // Fallback for any artworks missing both properties
    return 'https://via.placeholder.com/400x300?text=No+Image+Available';
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-5">Wishlist</h2>
      {wishlist.length === 0 ? (
        <div className="text-center mt-5"> {/* Increased top margin */}
          <p className="lead">Your wishlist is empty.</p>
        </div>
      ) : (
        <div className="row">
          {wishlist.map((artwork: Artwork) => (
            <div className="col-md-4 mb-4" key={artwork.id}>
              <div className="card">
                <img
                  src={getImageSrc(artwork)}
                  className="card-img-top"
                  alt={artwork.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{artwork.title}</h5>
                  <p className="card-text">{artwork.artist_title || 'Unknown Artist'}</p>
                  <p className="card-text">{artwork.date_display || ''}</p>
                  {artwork.username && (
                    <p className="card-text">Listed by: {artwork.username}</p>
                  )}
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemoveFromWishlist(artwork.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;