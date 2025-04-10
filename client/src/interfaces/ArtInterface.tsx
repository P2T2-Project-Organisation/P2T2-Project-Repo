import { useNavigate } from 'react-router-dom';

export interface Artwork {
  id: number;
  title: string;
  artist_title: string;
  date_display: string;
  image_id: string;
  price?: string | number;
  username?: string;
  imagePath?: string;
  category?: string;
  year?: string; // Add year property for filtering
  createdAt?: string; // Add createdAt field to track when auction items were created
  updatedAt?: string; // Add updatedAt field
  User?: {
    username: string;
  };
}

interface ArtInterfaceProps {
  artworks: Artwork[];
  currentArtworkPage: number;
  setCurrentArtworkPage: (page: number) => void;
  artworksPerPage: number;
  onArtworkClick: (artwork: Artwork) => void; // Function to handle artwork click
  children?: (artwork: Artwork) => JSX.Element; // Add children prop for custom rendering
}

const ArtInterface: React.FC<ArtInterfaceProps> = ({
  artworks,
  currentArtworkPage,
  setCurrentArtworkPage,
  artworksPerPage,
  onArtworkClick,
  children, // Add children prop for custom rendering
}) => {
  const navigate = useNavigate();
  const totalPages = Math.ceil(artworks.length / artworksPerPage);
  const startIndex = (currentArtworkPage - 1) * artworksPerPage;
  const endIndex = startIndex + artworksPerPage;
  const currentArtworks = artworks.slice(startIndex, endIndex);

  return (
    <div>
      <div className="row">
        {currentArtworks.map((artwork) => (
          <div className="col-md-4 mb-4" key={artwork.id}>
            <div className="card">
              {/* Remove default image rendering here - let parent component handle it */}
              <div className="card-body">
                {children && children(artwork)} {/* Render custom children */}
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${
                  currentArtworkPage === i + 1 ? 'active' : ''
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentArtworkPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ArtInterface;