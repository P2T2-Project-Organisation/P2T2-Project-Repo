import { useState } from "react";

const Home = () => {
    const [currentPage, setCurrentPage] = useState("Categories");

    return (
        <div className="container">
            {/* Sidebar Menu */}
            <div className="list-group">
                <a
                    href="#"
                    className={`list-group-item ${currentPage === "Categories" ? "active" : ""}`}
                    onClick={() => setCurrentPage("Categories")}
                >
                    Categories
                </a>
                <a
                    href="#"
                    className={`list-group-item ${currentPage === "Recently Viewed" ? "active" : ""}`}
                    onClick={() => setCurrentPage("Recently Viewed")}
                >
                    Recently Viewed
                </a>
                <a
                    href="#"
                    className={`list-group-item ${currentPage === "Trending" ? "active" : ""}`}
                    onClick={() => setCurrentPage("Trending")}
                >
                    Trending
                </a>
                <a
                    href="#"
                    className={`list-group-item ${currentPage === "History" ? "active" : ""}`}
                    onClick={() => setCurrentPage("History")}
                >
                    History
                </a>
            </div>

            {/* Main Content */}
            <div className="content">
                <h2>{currentPage}</h2>
                <p>Content for {currentPage} will go here.</p>
            </div>
        </div>
    );
};

export default Home;