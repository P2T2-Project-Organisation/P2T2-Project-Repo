import React, { useState } from "react";

interface CategoryButtonsProps {
  categories: string[];
  currentBatchIndex: number;
  calculateBatches: () => string[][];
  handleBatchChange: (direction: "next" | "prev") => void;
  setCurrentCategory: (category: string | null) => void;
  fetchArtworksByCategory: (category: string) => void;
  fadeClass: string;
}

const CategoryButtons: React.FC<CategoryButtonsProps> = ({
  categories,
  currentBatchIndex,
  calculateBatches,
  handleBatchChange,
  setCurrentCategory,
  fetchArtworksByCategory,
  fadeClass,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const batches = calculateBatches();
  const currentBatch = batches[currentBatchIndex];

  const handleCategoryClick = (category: string) => {
    setCurrentCategory(category);
    fetchArtworksByCategory(category);
  };

  return (
    <div className="category-buttons-container">
      {/* Desktop view */}
      <div className="desktop-category-buttons">
        <div className={`category-buttons ${fadeClass}`}>
          {currentBatch.map((category, index) => (
            <button
              key={index}
              className="btn btn-outline-primary category-button"
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="batch-navigation mt-2">
          <button
            className="btn btn-secondary mx-1"
            onClick={() => handleBatchChange("prev")}
            disabled={currentBatchIndex === 0}
          >
            ◀ Prev
          </button>
          <button
            className="btn btn-secondary mx-1"
            onClick={() => handleBatchChange("next")}
            disabled={currentBatchIndex === batches.length - 1}
          >
            Next ▶
          </button>
        </div>
      </div>

      {/* Mobile view */}
      <div className="mobile-category-dropdown">
        <button
          className="btn btn-primary dropdown-toggle"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          Select Category
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu show">
            {categories.map((category, index) => (
              <button
                key={index}
                className="dropdown-item"
                onClick={() => {
                  handleCategoryClick(category);
                  setIsDropdownOpen(false);
                }}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryButtons;
