import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Ensure useNavigate is imported
import logo from "../assets/logo.png";
import CategoryButtons from "../components/CategoryButtons";
import SearchBar from "../components/SearchBar";
import ArtInterface, { Artwork } from "../interfaces/ArtInterface"; // Use named export for Artwork

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
  const navigate = useNavigate(); // Ensure navigate is initialized
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState("Explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState("fade-in");
  const [currentArtworkPage, setCurrentArtworkPage] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState<Artwork[]>([]);
  const [_wishlist, setWishlist] = useState<Artwork[]>([]); // State for wishlist
  const [auctionArtworks, setAuctionArtworks] = useState<Artwork[]>([]); // State for auction artworks
  const [currentAuctionPage, setCurrentAuctionPage] = useState(1); // Pagination for auction
  const [bidItemId, setBidItemId] = useState<number | null>(null);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [bidSent, setBidSent] = useState<boolean>(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const [clickedButtonId, setClickedButtonId] = useState<number | null>(null);
  const [_cart, setCart] = useState<Artwork[]>([]); // New state for cart items
  const [_cartItems, setCartItems] = useState<number[]>([]); // New state to track items in cart by ID
  const [filterOption, setFilterOption] = useState<string>('');
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);

  const artworksPerPage = 9;

  useEffect(() => {
    fetchRandomArtworks();
  }, []);

  useEffect(() => {
    const storedRecentlyViewed = localStorage.getItem("recentlyViewed");
    if (storedRecentlyViewed) {
      try {
        const parsed = JSON.parse(storedRecentlyViewed);
        console.log("Loaded recently viewed from localStorage:", parsed);
        setRecentlyViewed(parsed);
      } catch (error) {
        console.error("Error parsing recently viewed from localStorage:", error);
      }
    }
  }, []);

  const generateRandomPrice = (): string => {
    const min = 1; // Minimum price in dollars
    const max = 1000000; // Maximum price in dollars
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

  const handleArtworkClick = (artwork: Artwork) => {
    setRecentlyViewed((prev) => {
      const alreadyViewed = prev.find((item) => item.id === artwork.id);
      if (alreadyViewed) return prev; // Avoid duplicates
      const updatedRecentlyViewed = [artwork, ...prev].slice(0, 10); // Limit to 10 items
      
      localStorage.setItem("recentlyViewed", JSON.stringify(updatedRecentlyViewed));
      
      return updatedRecentlyViewed;
    });
  };

  const handleBuyClick = (artwork: Artwork) => {
    const artworkToSave = {
      ...artwork,
      id: artwork.id,
      title: artwork.title,
      artist_title: artwork.artist_title || "Unknown Artist",
      date_display: artwork.date_display || "",
      image_id: artwork.image_id,
      price: artwork.price
    };

    console.log("Adding to recently viewed:", artworkToSave);
    
    setRecentlyViewed((prev) => {
      const alreadyViewed = prev.find((item) => item.id === artwork.id);
      if (alreadyViewed) return prev; // Avoid duplicates
      const updatedRecentlyViewed = [artworkToSave, ...prev].slice(0, 10); // Limit to 10 items
      
      localStorage.setItem("recentlyViewed", JSON.stringify(updatedRecentlyViewed));
      
      return updatedRecentlyViewed;
    });

    setTimeout(() => {
      navigate(`/ProductViewer/${artwork.id}`);
    }, 100);
  };

  const handleAddToWishlist = (artwork: Artwork) => {
    setWishlist((prev) => {
      const isInWishlist = prev.find((item) => item.id === artwork.id);
      const updatedWishlist = isInWishlist
        ? prev.filter((item) => item.id !== artwork.id) // Remove if already in wishlist
        : [...prev, artwork]; // Add if not in wishlist
      
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist)); // Save to localStorage
      
      // Dispatch event to notify navbar of wishlist update
      window.dispatchEvent(new Event('wishlistUpdated'));
      
      return updatedWishlist;
    });
  };

  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist)); // Load wishlist from localStorage
    }
  }, []);

  const fetchAuctionArtworks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('User is not logged in.');
        setAuctionArtworks([]);
        return;
      }

      const response = await fetch('/api/artworks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch auction artworks:', response.statusText);
        setAuctionArtworks([]);
        return;
      }

      const data = await response.json();
      const processedArtworks = Array.isArray(data)
        ? data.map((artwork) => ({
            ...artwork,
            username: artwork.User?.username || 'Unknown User',
            imagePath: artwork.imagePath,
            category: artwork.category || 'Uncategorized',
            // Make sure createdAt and updatedAt are properly included
            createdAt: artwork.createdAt || new Date().toISOString(),
          }))
        : [];
      
      console.log('Auction artworks with timestamps:', processedArtworks); // Log to verify data
      setAuctionArtworks(processedArtworks);
    } catch (error) {
      console.error('Error fetching auction artworks:', error);
      setAuctionArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string | number | undefined): string => {
    if (price === undefined || price === null) return '$0';
    if (typeof price === 'number') return `$${price.toLocaleString()}`;
    if (typeof price === 'string') {
      const numericPrice = parseFloat(price.replace(/[^0-9.-]+/g, ''));
      return `$${numericPrice.toLocaleString()}`;
    }
    return '$0';
  };

  const renderSuggestions = () => {
    if (!showSuggestions || !searchQuery) return null;

    const filteredSuggestions = auctionArtworks
      .filter((artwork) =>
        [artwork.title, artwork.artist_title, artwork.date_display]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 results

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
            <strong>{suggestion.title}</strong> by {suggestion.artist_title}{" "}
            {suggestion.date_display}
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (currentPage === 'Auction' && currentCategory) {
      // Reset to first page when changing categories in Auction page
      setCurrentAuctionPage(1);
    }
  }, [currentCategory, currentPage]);

  useEffect(() => {
    if (currentPage === 'Auction') {
      fetchAuctionArtworks(); // Fetch auction artworks when the Auction tab is active
      setCurrentCategory(null); // Reset category when switching to Auction tab
    }
  }, [currentPage]);

  const filterAuctionArtworksByCategory = (category: string) => {
    if (!category) {
      return auctionArtworks; // Return all artworks if no category is selected
    }
    
    // Make the category comparison case-insensitive
    return auctionArtworks.filter(artwork => 
      artwork.category && 
      artwork.category.toLowerCase() === category.toLowerCase()
    );
  };

  const handleBidSubmit = async (itemId: number) => {
    if (!bidAmount || isNaN(parseFloat(bidAmount)) || parseFloat(bidAmount) <= 0) {
      setBidError('Please enter a valid amount');
      return;
    }
    
    const artwork = auctionArtworks.find((art) => art.id === itemId);
    if (artwork) {
      handleArtworkClick(artwork); // Add to recently viewed
    }

    // Set the clicked button state to show orange color
    setClickedButtonId(itemId);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/Login');
        return;
      }
      
      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          artworkId: itemId,
          amount: parseFloat(bidAmount),
        }),
      });
      
      if (response.ok) {
        setBidSent(true);
        setTimeout(() => {
          setBidSent(false);
          setBidItemId(null);
          setBidAmount('');
          setBidError(null);
          setClickedButtonId(null); // Reset the clicked button state
        }, 3000);
      } else {
        setBidError('Failed to send bid. Please try again.');
        // Reset the clicked button state after a short delay
        setTimeout(() => setClickedButtonId(null), 1000);
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      setBidError('An error occurred while placing your bid.');
      // Reset the clicked button state after a short delay
      setTimeout(() => setClickedButtonId(null), 1000);
    }
  };

  const handleAddToCart = (artwork: Artwork) => {
    setCart((prevCart) => {
      const isInCart = prevCart.find((item) => item.id === artwork.id);
      if (isInCart) return prevCart; // Don't add duplicates
      
      const updatedCart = [...prevCart, artwork];
      localStorage.setItem('shoppingCart', JSON.stringify(updatedCart)); // Save to localStorage
      
      // Add the item ID to cartItems state
      setCartItems(prev => [...prev, artwork.id]);
      
      // Dispatch event to notify navbar of cart update
      window.dispatchEvent(new Event('cartUpdated'));
      
      return updatedCart;
    });
  };
  
  // Check if an item is in the cart
  // const isInCart = (id: number): boolean => {
  //   return cartItems.includes(id);
  // };

  // Load cart and cartItems from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('shoppingCart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCart(parsedCart);
      // Extract IDs from the cart items
      setCartItems(parsedCart.map((item: Artwork) => item.id));
    }
  }, []);

  const applyFilter = (artworksToFilter: Artwork[]): Artwork[] => {
    if (!filterOption || artworksToFilter.length === 0) {
      return artworksToFilter;
    }
    
    const sortedArtworks = [...artworksToFilter];
    
    switch (filterOption) {
      case 'priceHighToLow':
        return sortedArtworks.sort((a, b) => {
          const priceA = typeof a.price === 'string' ? parseFloat(a.price.replace(/[^0-9.-]+/g, '')) : (Number(a.price) || 0);
          const priceB = typeof b.price === 'string' ? parseFloat(b.price.replace(/[^0-9.-]+/g, '')) : (Number(b.price) || 0);
          return priceB - priceA;
        });
      case 'priceLowToHigh':
        return sortedArtworks.sort((a, b) => {
          const priceA = typeof a.price === 'string' ? parseFloat(a.price.replace(/[^0-9.-]+/g, '')) : (Number(a.price) || 0);
          const priceB = typeof b.price === 'string' ? parseFloat(b.price.replace(/[^0-9.-]+/g, '')) : (Number(b.price) || 0);
          return priceA - priceB;
        });
      case 'oldest':
        return sortedArtworks.sort((a, b) => {
          // For auction artworks, check for createdAt timestamp (available in auction listings)
          if (a.createdAt && b.createdAt) {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          }
          
          // Try using the year field for auction items
          if (a.year && b.year) {
            const yearA = parseInt(String(a.year).match(/\d{4}/)?.[0] || '0', 10);
            const yearB = parseInt(String(b.year).match(/\d{4}/)?.[0] || '0', 10);
            if (yearA > 0 && yearB > 0) {
              return yearA - yearB;
            }
          }
          
          // Try using date_display for regular artworks
          if (a.date_display && b.date_display) {
            const yearA = parseInt(String(a.date_display).match(/\d{4}/)?.[0] || '0', 10);
            const yearB = parseInt(String(b.date_display).match(/\d{4}/)?.[0] || '0', 10);
            if (yearA > 0 && yearB > 0) {
              return yearA - yearB;
            }
          }
          
          // If we can't determine years properly, use IDs as a last resort
          return a.id - b.id;
        });
      case 'newest':
        return sortedArtworks.sort((a, b) => {
          // For auction artworks, check for createdAt timestamp (available in auction listings)
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          
          // Try using the year field for auction items
          if (a.year && b.year) {
            const yearA = parseInt(String(a.year).match(/\d{4}/)?.[0] || '0', 10);
            const yearB = parseInt(String(b.year).match(/\d{4}/)?.[0] || '0', 10);
            if (yearA > 0 && yearB > 0) {
              return yearB - yearA;
            }
          }
          
          // Try using date_display for regular artworks
          if (a.date_display && b.date_display) {
            const yearA = parseInt(String(a.date_display).match(/\d{4}/)?.[0] || '0', 10);
            const yearB = parseInt(String(b.date_display).match(/\d{4}/)?.[0] || '0', 10);
            if (yearA > 0 && yearB > 0) {
              return yearB - yearA;
            }
          }
          
          // If we can't determine years properly, use IDs as a last resort (reversed for newest)
          return b.id - a.id;
        });
      default:
        return sortedArtworks;
    }
  };

  // Fix the FilterDropdown component to use type declaration
  const FilterDropdown = (): JSX.Element => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <div style={{ position: 'relative', display: 'inline-block', marginLeft: '10px' }}>
        <button
          onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            background: isHovered ? '#007bff' : 'none', // Change to blue on hover
            color: isHovered ? 'white' : 'inherit', // Change text color to white on hover
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            padding: '5px 10px',
            transition: 'background-color 0.3s ease, color 0.3s ease', // Add transition for smooth color change
          }}
        >
          🛠 Filter
        </button>
        
        {showFilterDropdown && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              backgroundColor: 'white',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              borderRadius: '5px',
              zIndex: 1000,
              width: '180px',
            }}
          >
            <div
              style={{ padding: '10px', fontWeight: 'bold', borderBottom: '1px solid #eee' }}
            >
              Sort By:
            </div>
            <button
              onClick={() => { setFilterOption('priceHighToLow'); setShowFilterDropdown(false); }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '10px',
                backgroundColor: filterOption === 'priceHighToLow' ? '#f0f0f0' : 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Price: High to Low
            </button>
            <button
              onClick={() => { setFilterOption('priceLowToHigh'); setShowFilterDropdown(false); }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '10px',
                backgroundColor: filterOption === 'priceLowToHigh' ? '#f0f0f0' : 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Price: Low to High
            </button>
            <button
              onClick={() => { setFilterOption('oldest'); setShowFilterDropdown(false); }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '10px',
                backgroundColor: filterOption === 'oldest' ? '#f0f0f0' : 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Oldest
            </button>
            <button
              onClick={() => { setFilterOption('newest'); setShowFilterDropdown(false); }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '10px',
                backgroundColor: filterOption === 'newest' ? '#f0f0f0' : 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Newest
            </button>
          </div>
        )}
      </div>
    );
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFilterDropdown && !(event.target as Element).closest('.filter-dropdown')) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterDropdown]);

  const renderAuctionContent = () => {
    if (!Array.isArray(auctionArtworks)) {
      console.error('Invalid auctionArtworks data:', auctionArtworks);
      return <p>Error loading auction artworks.</p>;
    }

    // Load all artworks when no category is selected
    const filteredArtworks = currentCategory 
      ? filterAuctionArtworksByCategory(currentCategory)
      : auctionArtworks;
      
    console.log("Current category:", currentCategory);
    console.log("Available auction artworks:", auctionArtworks);
    console.log("Filtered artworks:", filteredArtworks);
    console.log("Available categories in auction:", [...new Set(auctionArtworks.map(art => art.category))]);

    const filteredAndSortedArtworks = applyFilter(filteredArtworks);
    
    const totalPages = Math.ceil(filteredAndSortedArtworks.length / artworksPerPage);
    const startIndex = (currentAuctionPage - 1) * artworksPerPage;
    const endIndex = startIndex + artworksPerPage;
    const currentArtworks = filteredAndSortedArtworks.slice(startIndex, endIndex);

    // Create a custom category handler for Auction page
    // const handleAuctionCategorySelect = (category: string) => {
    //   setCurrentCategory(category);
    //   // Don't call setCurrentAuctionPage here - it's handled by the useEffect above
    // };

    return (
      <>
        <h1 className="text-center mb-4" style={{ fontSize: "4rem" }}>Auction 🧑‍⚖️</h1>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          renderSuggestions={renderSuggestions}
        />
        {/* Fixed styling for category button container */}
        <div style={{ width: '100%', overflow: 'visible', margin: '0 auto', position: 'relative' }}>
          <CategoryButtons
            categories={categories}
            currentBatchIndex={currentBatchIndex}
            calculateBatches={calculateBatches}
            handleBatchChange={handleBatchChange}
            setCurrentCategory={setCurrentCategory}
            fetchArtworksByCategory={(category) => {
              console.log("Selected category:", category);
              setCurrentCategory(category);
              setCurrentAuctionPage(1);
            }}
            fadeClass={fadeClass}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="mt-4">{currentCategory || 'All Auction Artworks'}</h2>
          <div className="filter-dropdown">
            <FilterDropdown />
          </div>
        </div>
        {loading ? (
          <p>Loading artworks...</p>
        ) : currentArtworks.length === 0 ? (
          <div className="alert alert-info mt-3">
            There are currently no listings in this category.
          </div>
        ) : (
          <ArtInterface
            artworks={currentArtworks}
            currentArtworkPage={currentAuctionPage}
            setCurrentArtworkPage={setCurrentAuctionPage}
            artworksPerPage={artworksPerPage}
            onArtworkClick={() => {}} // No action on artwork click
          >
            {(artwork) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Ensure only one image is rendered */}
                <img
                  src={artwork.imagePath} // Use the correct imagePath
                  alt={artwork.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <h5 style={{ fontWeight: 'bold', color: '#333', marginTop: '10px' }}>
                  {artwork.title}
                </h5>
                <span style={{ fontWeight: 'bold', color: '#555' }}>
                  Listed by: {artwork.username}
                </span>
                <p
                  style={{
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    color: '#333',
                  }}
                >
                  {formatPrice(artwork.price)}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the card click
                      setBidItemId(bidItemId === artwork.id ? null : artwork.id);
                      setBidSent(false);
                      setBidError(null);
                    }}
                  >
                    Bid
                  </button>
                  <button
                    className="btn btn-blue"
                    onClick={() => handleAddToWishlist(artwork)}
                  >
                    Add to Wishlist
                  </button>
                </div>
                
                {/* Bid input form */}
                {bidItemId === artwork.id && (
                  <div className="bid-form" style={{ marginTop: '10px' }}>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter asking price"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min="1"
                        step="0.01"
                      />
                      <button 
                        className={`btn ${clickedButtonId === artwork.id ? 'btn-warning' : 'btn-success'}`}
                        type="button"
                        onClick={() => handleBidSubmit(artwork.id)}
                        style={{ 
                          backgroundColor: clickedButtonId === artwork.id ? '#fd7e14' : '#28a745',
                          borderColor: clickedButtonId === artwork.id ? '#fd7e14' : '#28a745',
                          color: 'white'
                        }}
                      >
                        Send
                      </button>
                    </div>
                    {bidError && (
                      <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
                        {bidError}
                      </div>
                    )}
                    {bidSent && (
                      <div className="text-success mt-1" style={{ fontSize: '0.875rem' }}>
                        Sent successfully
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </ArtInterface>
        )}
        {totalPages > 1 && (
          <nav>
            <ul className="pagination justify-content-center">
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentAuctionPage === i + 1 ? 'active' : ''}`}
                  style={{ margin: '0 5px' }} // Add margin for separation
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentAuctionPage(i + 1)}
                    style={{
                      borderRadius: '50%', // Make buttons circular
                      width: '40px', // Fixed width
                      height: '40px', // Fixed height
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0', // Remove padding
                      backgroundColor: currentAuctionPage === i + 1 ? '#007bff' : '#fff', // Use Bootstrap colors
                      color: currentAuctionPage === i + 1 ? '#fff' : '#007bff',
                      border: '1px solid #007bff',
                    }}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </>
    );
  };

  const renderExploreContent = () => {
    const filteredAndSortedArtworks = applyFilter(artworks);
    
    const totalPages = Math.ceil(filteredAndSortedArtworks.length / artworksPerPage);
    const startIndex = (currentArtworkPage - 1) * artworksPerPage;
    const endIndex = startIndex + artworksPerPage;
    const currentArtworks = filteredAndSortedArtworks.slice(startIndex, endIndex);

    return (
      <>
        <div className="text-center mb-3" style={{ backgroundColor: 'var(--background-color)' }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="mt-4">{currentCategory || 'Artworks'}</h2>
          <div className="filter-dropdown">
            <FilterDropdown />
          </div>
        </div>
        {loading ? (
          <p>Loading artworks...</p>
        ) : (
          <ArtInterface
            artworks={currentArtworks}
            currentArtworkPage={currentArtworkPage}
            setCurrentArtworkPage={setCurrentArtworkPage}
            artworksPerPage={artworksPerPage}
            onArtworkClick={handleArtworkClick}
          >
            {(artwork) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Ensure only one image is rendered */}
                <img
                  src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
                  alt={artwork.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <h5 style={{ fontWeight: 'bold', color: '#333', marginTop: '10px' }}>
                  {artwork.title}
                </h5>
                <p style={{ color: '#555' }}>
                  <strong>Artist:</strong> {artwork.artist_title || 'Unknown Artist'}
                </p>
                <p style={{ color: '#555' }}>
                  <strong>Date:</strong> {artwork.date_display || 'Unknown Date'}
                </p>
                <p style={{ 
                  fontWeight: 'bold', 
                  fontSize: '1.2rem', 
                  color: '#333',
                  marginTop: '5px',
                  marginBottom: '10px'
                }}>
                  {formatPrice(artwork.price)}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyClick(artwork); // Ensure this adds to recently viewed
                    }}
                  >
                    Buy
                  </button>
                  <button
                    className="btn btn-orange"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(artwork);
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-blue"
                    onClick={() => handleAddToWishlist(artwork)}
                  >
                    Add to Wishlist
                  </button>
                </div>
              </div>
            )}
          </ArtInterface>
        )}
        {totalPages > 1 && (
          <nav>
            <ul className="pagination justify-content-center">
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentArtworkPage === i + 1 ? 'active' : ''}`}
                  style={{ margin: '0 5px' }} // Add margin for separation
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentArtworkPage(i + 1)}
                    style={{
                      borderRadius: '50%', // Make buttons circular
                      width: '40px', // Fixed width
                      height: '40px', // Fixed height
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0', // Remove padding
                      backgroundColor: currentArtworkPage === i + 1 ? '#007bff' : '#fff', // Use Bootstrap colors
                      color: currentArtworkPage === i + 1 ? '#fff' : '#007bff',
                      border: '1px solid #007bff',
                    }}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </>
    );
  };

  const renderRecentlyViewedContent = () => {
    console.log("Rendering recently viewed content:", recentlyViewed);
    
    return (
      <div className="recently-viewed-container">
        <h2 className="mb-4">Recently Viewed Artworks</h2>
        {recentlyViewed.length === 0 ? (
          <p>No artworks viewed yet. Click "Buy" on any artwork to add it here.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Description</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {recentlyViewed.map((artwork) => (
                  <tr key={artwork.id}>
                    <td style={{ width: "100px" }}>
                      {artwork.image_id ? (
                        <img
                          src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/100,/0/default.jpg`}
                          alt={artwork.title}
                          style={{ width: "80px", height: "auto", borderRadius: "5px" }}
                        />
                      ) : artwork.imagePath && typeof artwork.imagePath === 'string' ? (
                        <img
                          src={artwork.imagePath.indexOf('http') === 0 ? artwork.imagePath : `/uploads/images/${artwork.imagePath}`}
                          alt={artwork.title}
                          style={{ width: "80px", height: "auto", borderRadius: "5px" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "80px",
                            height: "80px",
                            background: "#eee",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          No Image
                        </div>
                      )}
                    </td>
                    <td>{artwork.title}</td>
                    <td>{artwork.artist_title || "Unknown Artist"}</td>
                    <td>{artwork.date_display || "No description available"}</td>
                    <td>{formatPrice(artwork.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (currentPage) {
      case "Explore":
        return renderExploreContent();
      case "Auction":
        return renderAuctionContent();
      case "Recently Viewed":
        return renderRecentlyViewedContent();
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
              🔍 Explore
            </button>
            <button
              className={`list-group-item ${
                currentPage === "Auction" ? "active" : ""
              }`}
              onClick={() => setCurrentPage("Auction")}
            >
              🧑‍⚖️ Auction
            </button>
            <button
              className={`list-group-item ${
                currentPage === "Recently Viewed" ? "active" : ""
              }`}
              onClick={() => setCurrentPage("Recently Viewed")}
            >
              👀 Recently Viewed
            </button>
          </div>
        </div>
        <div className="col-md-9">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Home;