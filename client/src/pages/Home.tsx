import { useState } from "react";

const Home = () => {
    const [currentPage, setCurrentPage] = useState("Categories");

    return (
        <section>
            <div className="container mt-4 text-center content">
                <h2>Home</h2>
                <div className="d-flex justify-content-center gap-3 mt-3">
                    <a
                        href="#"
                        className={`btn ${currentPage === "Categories" ? "btn-primary" : "btn-secondary"}`}
                        onClick={() => setCurrentPage("Categories")}
                    >
                        Categories
                    </a>
                    <a
                        href="#"
                        className={`btn ${currentPage === "Recently Viewed" ? "btn-primary" : "btn-secondary"}`}
                        onClick={() => setCurrentPage("Recently Viewed")}
                    >
                        Recently Viewed
                    </a>
                    <a
                        href="#"
                        className={`btn ${currentPage === "Trending" ? "btn-primary" : "btn-success"}`}
                        onClick={() => setCurrentPage("Trending")}
                    >
                        Trending
                    </a>
                    <a
                        href="#"
                        className={`btn ${currentPage === "History" ? "btn-primary" : "btn-secondary"}`}
                        onClick={() => setCurrentPage("History")}
                    >
                        History
                    </a>
                </div>
            </div>
            <footer className="text-center mt-auto py-3 bg-light">
                &copy; 2025 Project 2
            </footer>
        </section>
    );
};

export default Home;