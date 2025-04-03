const Home = () => {
    return (
        <section>
            <div className="container mt-4 text-center content">
                <h2>Home</h2>
                    <div className="d-flex justify-content-center gap-3 mt-3">
                        <a href="#" className="btn btn-primary">Categories</a>
                        <a href="#" className="btn btn-secondary">Recently Viewed</a>
                        <a href="#" className="btn btn-success">Trending</a>
                        <a href="#" className="btn btn-danger">History</a>
                    </div>
                </div>
            <footer className="text-center mt-auto py-3 bg-light">
                &copy; 2025 Project 2
            </footer>
        </section>
    );
};

export default Home;