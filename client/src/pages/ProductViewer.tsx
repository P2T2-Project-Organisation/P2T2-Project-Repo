const ProductViewer = () => {
    return (
        <section>
            <nav className="navbar navbar-light bg-light">
        <div className="container text-center">
            <span className="navbar-brand mb-0 h1 w-100">Single Bid Page</span>
        </div>
    </nav>
    
    <div className="container mt-4 content">
        {/* <img src="../assets/art_sample.jpeg" className="img-fluid" alt="Item Image"></img> */}
        
        <div className="item-details">
            <h2>Item Title</h2>
            <h3>$Price</h3>
        </div>
        
        <div className="specifications">
            <h4>Item Specifications</h4>
            <ul>
                <li>Specification 1</li>
                <li>Specification 2</li>
                <li>Specification 3</li>
            </ul>
        </div>
        
        <div className="mt-4">
            <button className="btn btn-primary">Place Bid</button>
        </div>
    </div>
    <a id="artwork-url">
      <div id="artwork-container"></div>
      <img id="artwork-save-overlay" />
    </a>
    <a id="tombstone">
      <div id="title"></div>
      <div id="artist"></div>
    </a>
    
    <footer className="text-center mt-auto py-3">
        &copy; 2025 Project 2
    </footer>
        </section>
    );
};

export default ProductViewer;