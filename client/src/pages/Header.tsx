function Header() {
  return (
    <div>
    <nav className="navbar navbar-light bg-light">
        <div className="container text-center">
            <span className="navbar-brand mb-0 h1 w-100">Header/Nav Bar</span>
        </div>
    </nav>

    <div className="container content">
        <div className="item">
            <h3>Item 1</h3>
            <div className="bid-ask">
                <p><strong>Bid:</strong> $100</p>
                <p><strong>Ask:</strong> $110</p>
            </div>
            {/* <img src="../assets/art_sample.jpeg" alt="Item 1 Image"> </img> */}
        </div>

        <div className="item">
            <h3>Item 2</h3>
            <div className="bid-ask">
                <p><strong>Bid:</strong> $200</p>
                <p><strong>Ask:</strong> $210</p>
            </div>
            {/* <img src="../assets/art_sample.jpeg" alt="Item 2 Image"> </img> */}
        </div>

        <div className="item">
            <h3>Item 3</h3>
            <div className="bid-ask">
                <p><strong>Bid:</strong> $300</p>
                <p><strong>Ask:</strong> $310</p>
            </div>
            {/* <img src="../assets/art_sample.jpeg" alt="Item 3 Image"> </img> */}
        </div>
    </div>
    </div>
  );
}

export default Header;