import React from "react";

interface CategoryButtonsProps {
  categories: string[];
  currentBatchIndex: number;
  calculateBatches: () => string[][];
  handleBatchChange: (direction: "next" | "prev") => void;
  setCurrentCategory: (category: string) => void;
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
  const batches = calculateBatches();
  const totalBatches = batches.length;
  const currentBatch = batches[currentBatchIndex] || [];

  return (
    <div>
      {/* Batch Indicator */}
      <div className="text-center mt-2">
        <small>
          {currentBatchIndex + 1} of {totalBatches}
        </small>
      </div>

      <div
        className={`d-flex align-items-center mt-3 ${fadeClass}`}
        style={{
          justifyContent: "center",
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {currentBatchIndex > 0 && (
          <button
            className="btn btn-secondary mx-1"
            onClick={() => handleBatchChange("prev")}
          >
            &lt;
          </button>
        )}
        <div
          className="d-flex justify-content-center"
          style={{
            flexGrow: 1,
            whiteSpace: "nowrap",
          }}
        >
          {currentBatch.map((category) => (
            <button
              key={category}
              className="btn btn-outline-primary mx-1"
              style={{
                padding: "8px 12px",
                height: "45px",
                textAlign: "center",
                fontSize: "13px",
                fontWeight: "bold",
                borderRadius: "8px",
                whiteSpace: "nowrap",
              }}
              onClick={() => {
                setCurrentCategory(category);
                fetchArtworksByCategory(category);
              }}
            >
              {category}
            </button>
          ))}
        </div>
        {currentBatchIndex < totalBatches - 1 && (
          <button
            className="btn btn-secondary mx-1"
            onClick={() => handleBatchChange("next")}
          >
            &gt;
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryButtons;
