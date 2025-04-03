const AccountPage = () => {
    return (
        <div className="container mt-4">
        <h2 className="text-center">Profile - My Account</h2>
        <div className="row">
            <div className="col-md-3">
                <div className="list-group">
                    <a href="AccountPage" className="list-group-item list-group-item-action active">My Account</a>
                    <a href="Wishlist" className="list-group-item list-group-item-action">Wishlist</a>
                    <a href="Purchases" className="list-group-item list-group-item-action">Purchases</a>
                </div>
            </div>
            <div className="col-md-9 bg-light p-4">
                <h4>My Account</h4>
                <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center">
                        PROFILE
                    </div>
                    <div className="ms-3">
                        <h5>Name</h5>
                        <p>Account Created Date</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    
    );
};

export default AccountPage;