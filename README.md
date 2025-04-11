# MyOpus Artwork Marketplace

[Live Demo](https://p2t2-project-render-deploy.onrender.com/)

This is a dynamic art auction and marketplace application that allows users to explore, buy, sell, and interact with art in a seamless way. The app is built to provide a platform for users to auction their artworks, place bids, share posts, and more.

<img width="1430" alt="Screen Shot 2025-04-11 at 1 09 20 PM" src="https://github.com/user-attachments/assets/4db34020-951f-499c-ae58-5d50eab8f7ee" />


![license](https://img.shields.io/badge/license-MIT-blue.svg)

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Technologies Used](#technologies-used)
- [License](#license)

## Features

- **Home Page**: A central hub featuring three main sections:
  - **Explore**: Displays a curated collection of artworks imported from the Chicago Museum of Art API.
  - **Auction**: Users can browse listings created by other users, place bids, and interact with auctions.
  - **Recently Viewed**: A section where users can quickly access art they have recently explored.

- **Auction Page**: Where users can list their art for auction, manage current bids, and sell their pieces to the highest bidder.

- **Account Page**: Displays user account information and a collection of artworks the user has currently listed for auction.

- **Community Page**: A space for users to share posts, interact with other users, and discuss art with the community.

- **Sell Page**: Enables users to list new artworks for sale on the auction page.

- **Offers Page**: Users can view offers that other users have sent for their listed artwork.

- **Cart and Wishlist**: Allows users to add artwork to their cart for future purchase or save it for later viewing in the wishlist.

- **Stripe Payment Checkout**: Integrated Stripe API for secure payment processing and smooth transaction experience.

## Installation

1. Clone the repository:  
   `git clone <repo-url>`

2. Navigate into the project directory:  
   `cd <project-name>`

3. Install dependencies:  
   `npm install`

4. Start the app:  
   `npm start`

## Technologies Used
- **PostgreSQL** (Database)
- **Express** (Backend)
- **React** (Frontend)
- **Node.js** (Runtime Environment)
- **Stripe API** (Payment Processing)
- Chicago Museum of Art API (for art data)

## License
This project is licensed under the MIT License.
