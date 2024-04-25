# Yacouba's Furniture Website

## Project Description

Yacouba's Furniture offers a wide selection of furniture, enabling customers to discover their perfect space with stylish and comfortable pieces.

## Features

- Product Listing: Browse all products or filter by category such as Chairs, Tables, and Sofas.
- Product Details: View detailed information about each product including price, description, and images.
- Currency Conversion: View product prices in different currencies using the latest exchange rates.

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: SQLite
- Third-Party APIs:
  - Currency Conversion: ExchangeRate-API

## Setup and Installation

1. Clone the repository:
2. Install the dependencies: npm install
3. Start the server: npm start
4. Open `http://localhost:300` in browser

## API Endpoints

- `/api/products`: Fetch all products.
- `/api/products/:id`: Fetch a single product by ID.
- `/api/category/:categoryId`: Fetch products by category ID.
- `/api/products/bulk-upload`: Endpoint for bulk uploading products.

## Bulk Upload

To bulk upload products make sure your file follows the format specified in `bulkupload.html` and use the bulk upload feature on the admin page.
