export default function Purchases(){
  return (
    <div className="container mt-4">
    <h2 className="text-center">Profile - Purchases</h2>
    <div className="row">
        <div className="col-md-3">
            <div className="list-group">
                <a href="myaccount.html" className="list-group-item list-group-item-action">My Account</a>
                <a href="wishlist.html" className="list-group-item list-group-item-action">Wishlist</a>
                <a href="purchases.html" className="list-group-item list-group-item-action active">Purchases</a>
            </div>
        </div>
            <div className="col-md-9 bg-light p-4">
                <h4>Purchases</h4>
                <p>Your purchased items will be displayed here.</p>
            </div>
     </div>
    </div>
  );
}