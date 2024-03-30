CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at DATETIME NOT NULL, 
  name TEXT NOT NULL, 
  email TEXT NOT NULL, 
  password TEXT NOT NULL, 
  user_type TEXT NOT NULL CHECK(user_type IN ('admin', 'shopper'))
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, 
  menu_order INTEGER NOT NULL
); 

CREATE TABLE IF NOT EXISTS carts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status TEXT NOT NULL CHECK(status IN ('new', 'abandoned', 'purchased')),
    created_at DATETIME NOT NULL,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT, 
  image_url TEXT, 
  price DECIMAL (10, 2) NOT NULL, 
  category_id INTEGER, 
  is_featured BIT NOT NULL, 
  FOREIGN KEY (category_id) REFERENCES categories (id) 
)

CREATE TABLE IF NOT EXISTS cart_products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cart_id INTEGER NOT NULL, 
  product_id INTEGER NOT NULL, 
  quantity INTEGER NOT NULL
  FOREIGN KEY (cart_id) REFERENCES carts(id),
  FOREIGN KEY (product_id) REFERENCES Products(id)
);

