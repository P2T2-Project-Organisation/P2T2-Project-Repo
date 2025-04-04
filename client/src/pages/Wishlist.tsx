export default function Wishlist() {
    return ( 
<div className="container mt-4">
        <h2 className="text-center">Profile - Wishlist</h2>
        <div className="row">
            <div className="col-md-3">
                <div className="list-group">
                    <a href="AccountPage" className="list-group-item list-group-item-action">My Account</a>
                    <a href="Wishlist" className="list-group-item list-group-item-action active">Wishlist</a>
                    <a href="Purchases" className="list-group-item list-group-item-action">Purchases</a>
                </div>
            </div>
            <div className="col-md-9 bg-light p-4">
                <h4>Wishlist</h4>
                <p>Your wishlist items will be displayed here.</p>
            </div>
        </div>
    </div>

    )
}