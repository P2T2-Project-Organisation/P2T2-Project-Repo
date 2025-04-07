import { useNavigate } from 'react-router-dom';

interface Artwork {
  id: number;
  title: string;
  artist_title: string;
  date_display: string;
  image_id: string;
  price?: string;
}

interface ArtInterfaceProps {
  artworks: Artwork[];
  currentArtworkPage: number;
  setCurrentArtworkPage: (page: number) => void;
  artworksPerPage: number;
}

const ArtInterface: React.FC<ArtInterfaceProps> = ({
  artworks,
  currentArtworkPage,
  setCurrentArtworkPage,
  artworksPerPage,
}) => {
  const navigate = useNavigate();
  const totalPages = Math.ceil(artworks.length / artworksPerPage);
  const startIndex = (currentArtworkPage - 1) * artworksPerPage;
  const endIndex = startIndex + artworksPerPage;
  const currentArtworks = artworks.slice(startIndex, endIndex);

  return (
    <div>
      <div className="row">
        {currentArtworks.map((artwork, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card">
              <img
                src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
                className="card-img-top"
                alt={artwork.title}
              />
              <div className="card-body">
                <h5 className="card-title">{artwork.title}</h5>
                <p className="card-text">
                  {artwork.artist_title} ({artwork.date_display})
                </p>
                <p
                  className="card-price"
                  style={{ fontWeight: "bold", fontSize: "1.2rem" }}
                >
                  {artwork.price}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/ProductViewer/${artwork.id}`)} // Navigate to ProductViewer
                >
                  Buy
                </button>
                <button className="btn btn-primary">Bid</button>
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
                  currentArtworkPage === i + 1 ? "active" : ""
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