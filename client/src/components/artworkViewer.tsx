import React, { useEffect, useState, useRef } from 'react';
import OpenSeadragon from 'openseadragon';

interface Artwork {
  id: number;
  title: string;
  artist_title: string;
  date_display: string;
  image_id: string;
  thumbnail: {
    width: number;
    height: number;
  };
}

interface ArtworkViewerProps {
  artworkId: number;
}

const ArtworkViewer: React.FC<ArtworkViewerProps> = ({ artworkId }) => {
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [_viewer, setViewer] = useState<any>(null);

  // Create a ref to store the container element
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Fetch artwork data based on artworkId
    fetch(`https://api.artic.edu/api/v1/artworks/${artworkId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched data:', data); // Log data to inspect it
        const artwork = data.data ? data.data : null;
        if (artwork) {
          setArtwork(artwork);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching artwork data:', error);
        setArtwork(null);
        setLoading(false);
      });
  }, [artworkId]);

  // Initialize OpenSeadragon viewer after the artwork is set
  useEffect(() => {
    if (artwork && containerRef.current) {
      const viewerInstance = OpenSeadragon({
        element: containerRef.current,
        prefixUrl: '//openseadragon.github.io/openseadragon/images/',
        homeFillsViewer: true,
        mouseNavEnabled: true,
        springStiffness: 15,
        visibilityRatio: 1,
        zoomPerScroll: 1.2,
        zoomPerClick: 1.3,
        immediateRender: true,
        constrainDuringPan: true,
        animationTime: 1.5,
        minZoomLevel: 0,
        minZoomImageRatio: 0.8,
        maxZoomPixelRatio: 1.0,
        defaultZoomLevel: 0,
        gestureSettingsMouse: {
          scrollToZoom: true,
        },
        showZoomControl: true,
        showHomeControl: true,
        showFullPageControl: false,
        showRotationControl: false,
        showSequenceControl: false,
      });

      // Generate the image URL
      const downloadUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/3000,/0/default.jpg`;

      // Log the URL to make sure it's correct
      console.log('Generated image URL:', downloadUrl);

      // Add the image as a tiled image to OpenSeadragon
      viewerInstance.addTiledImage({
        tileSource: {
          type: 'legacy-image-pyramid',
          levels: [
            { url: downloadUrl, width: 3000, height: 2000 },
            { url: downloadUrl, width: 4000, height: 2500 },
            { url: downloadUrl, width: 5000, height: 3000 },
          ],
        },
      });

      setViewer(viewerInstance);
    }
  }, [artwork]); // Only re-run when `artwork` is updated

  return (
    <div>
      {loading ? (
        <div>Loading...</div> // Show loading message while fetching
      ) : (
        <div>
          <div ref={containerRef} style={{ width: '100%', height: '600px' }}></div>
          <div>
            <h2>{artwork?.title}</h2>
            <p>{artwork?.artist_title}, {artwork?.date_display}</p>
            <a href={`https://www.artic.edu/artworks/${artwork?.id}`} target="_blank" rel="noopener noreferrer">
              View Artwork on the Art Institute Website
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworkViewer;
