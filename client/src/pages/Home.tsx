import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import CategoryButtons from "../components/CategoryButtons";
import SearchBar from "../components/SearchBar";
import ArtInterface from "../components/ArtInterface";

interface Artwork {
  id: number;
  title: string;
  artist_title: string;
  date_display: string;
  image_id: string;
  price?: string;
}

const categories = [
  "CITYSCAPES",
  "IMPRESSIONISM",
  "ANIMALS",
  "ESSENTIALS",
  "AFRICAN DIASPORA",
  "FASHION",
  "CHICAGO ARTISTS",
  "POP ART",
  "MYTHOLOGY",
  "SURREALISM",
  "ARMS AND ARMOR",
  "PORTRAITS",
  "MASKS",
  "DRINKING AND DINING",
  "FURNITURE",
  "ARCHITECTURE",
  "LANDSCAPES",
  "ART DECO",
  "ANCIENT",
  "MINIATURE",
  "WOODBLOCK PRINT",
  "STILL LIFE",
  "MODERNISM",
];

const Home = () => {
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState("Explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState("fade-in");
  const [currentArtworkPage, setCurrentArtworkPage] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const artworksPerPage = 9;

  useEffect(() => {
    fetchRandomArtworks();
  }, []);

  const generateRandomPrice = (): string => {
    const min = 100;
    const max = 7000000;
    const randomPrice = Math.floor(Math.random() * (max - min + 1)) + min;
    return `$${randomPrice.toLocaleString()}`;
  };

  const fetchRandomArtworks = async () => {
    setLoading(true);
    try {
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks/search?q=${randomCategory}&fields=id,title,artist_title,date_display,image_id&page=1&limit=100`
      );
      const data = await response.json();
      const artworksWithPrices = (data.data || []).map((artwork: Artwork) => ({
        ...artwork,
        price: generateRandomPrice(),
      }));
      setArtworks(artworksWithPrices);
    } catch (error) {
      console.error("Error fetching random artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArtworksByCategory = async (category: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks/search?q=${category}&fields=id,title,artist_title,date_display,image_id&page=1&limit=100`
      );
      const data = await response.json();
      const artworksWithPrices = (data.data || []).map((artwork: Artwork) => ({
        ...artwork,
        price: generateRandomPrice(),
      }));
      setArtworks(artworksWithPrices);
    } catch (error) {
      console.error("Error fetching artworks by category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks/search?q=${searchQuery}&fields=id,title,artist_title,date_display,image_id`
      );
      const data = await response.json();
      const artworksWithPrices = (data.data || []).map((artwork: Artwork) => ({
        ...artwork,
        price: generateRandomPrice(), // Assign a random price to each artwork
      }));
      setArtworks(artworksWithPrices);
      setShowSuggestions(false); // Hide suggestions after search
    } catch (error) {
      console.error("Error searching artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateBatches = () => {
    const batches: string[][] = [];
    let currentBatch: string[] = [];
    let currentWidth = 0;
    const containerWidth = 800;
    const buttonWidth = 140;

    categories.forEach((category) => {
      if (currentWidth + buttonWidth > containerWidth) {
        batches.push(currentBatch);
        currentBatch = [];
        currentWidth = 0;
      }
      currentBatch.push(category);
      currentWidth += buttonWidth;
    });

    if (currentBatch.length > 0) {
      batches.push(currentBatch);
    }

    return batches;
  };

  const handleBatchChange = (direction: "next" | "prev") => {
    setFadeClass("fade-out");
    setTimeout(() => {
      setCurrentBatchIndex((prev) => {
        const batches = calculateBatches();
        const totalBatches = batches.length;
        if (direction === "next" && prev < totalBatches - 1) {
          return prev + 1;
        } else if (direction === "prev" && prev > 0) {
          return prev - 1;
        }
        return prev;
      });
      setFadeClass("fade-in");
    }, 300);
  };

  const renderSuggestions = () => {
    if (!showSuggestions || !searchQuery) return null;

    const filteredSuggestions = artworks
      .filter((artwork) =>
        [artwork.title, artwork.artist_title, artwork.date_display]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);

    return (
      <div
        className="suggestions-tooltip"
        style={{
          position: "absolute",
          top: "100%",
          left: "0",
          width: "100%",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
        }}
      >
        {filteredSuggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="suggestion-item"
            style={{
              padding: "10px",
              cursor: "pointer",
              borderBottom: "1px solid #eee",
            }}
            onClick={() => {
              setSearchQuery(suggestion.title); // Set the search query to the clicked suggestion
              setShowSuggestions(false); // Hide the tooltip
            }}
          >
            <strong>{suggestion.title}</strong> by {suggestion.artist_title} (
            {suggestion.date_display})
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (currentPage) {
      case "Explore":
        return (
          <>
            <div className="text-center mb-3">
              <img
                src={logo}
                alt="Logo"
                style={{
                  width: "150px",
                  height: "auto",
                }}
              />
            </div>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              renderSuggestions={renderSuggestions}
            />
            <CategoryButtons
              categories={categories}
              currentBatchIndex={currentBatchIndex}
              calculateBatches={calculateBatches}
              handleBatchChange={handleBatchChange}
              setCurrentCategory={setCurrentCategory}
              fetchArtworksByCategory={fetchArtworksByCategory}
              fadeClass={fadeClass}
            />
            <h2 className="mt-4">{currentCategory || "Artworks"}</h2>
            {loading ? (
              <p>Loading artworks...</p>
            ) : (
              <ArtInterface
                artworks={artworks}
                currentArtworkPage={currentArtworkPage}
                setCurrentArtworkPage={setCurrentArtworkPage}
                artworksPerPage={artworksPerPage}
              />
            )}
          </>
        );
      case "Recently Viewed":
        return <div>Recently Viewed content will go here.</div>;
      case "Trending":
        return <div>Trending content will go here.</div>;
      case "History":
        return <div>History content will go here.</div>;
      default:
        return <div>Select a page from the sidebar.</div>;
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3">
          <div className="list-group mb-4">
            <button
              className={`list-group-item ${
                currentPage === "Explore" ? "active" : ""
              }`}
              onClick={() => setCurrentPage("Explore")}
            >
              Explore
            </button>
            <button
              className={`list-group-item ${
                currentPage === "Recently Viewed" ? "active" : ""
              }`}
              onClick={() => setCurrentPage("Recently Viewed")}
            >
              Recently Viewed
            </button>
            <button
              className={`list-group-item ${
                currentPage === "Trending" ? "active" : ""
              }`}
              onClick={() => setCurrentPage("Trending")}
            >
              Trending
            </button>
            <button
              className={`list-group-item ${
                currentPage === "History" ? "active" : ""
              }`}
              onClick={() => setCurrentPage("History")}
            >
              History
            </button>
          </div>
        </div>
        <div className="col-md-9">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Home;