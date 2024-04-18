const express = require("express");
const router = express.Router();
const { db } = require("../database");

// Helper function to create a new cart for a user
function createCart(userId, callback) {
  const status = "new";
  const createdAt = new Date().toISOString();

  db.run(
    "INSERT INTO carts (status, created_at, user_id) VALUES (?, ?, ?)",
    [status, createdAt, userId],
    function (err) {
      if (err) {
        return callback(err);
      }
      return callback(null, this.lastID);
    }
  );
}

// Helper function to find or create a cart for a user
function findOrCreateCart(userId, callback) {
  db.get(
    'SELECT * FROM carts WHERE user_id = ? AND status = "new"',
    [userId],
    function (err, cart) {
      if (err) {
        return callback(err);
      }
      if (cart) {
        return callback(null, cart.id);
      } else {
        createCart(userId, callback);
      }
    }
  );
}

// Add an item to the cart
router.post("/:userId/add", (req, res) => {
  const userId = req.params.userId;
  const { productId, quantity } = req.body;

  findOrCreateCart(userId, (err, cartId) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    db.run(
      "INSERT INTO cart_products (cart_id, product_id, quantity) VALUES (?, ?, ?)",
      [cartId, productId, quantity],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Product added to cart", cartId: cartId });
      }
    );
  });
});

// Update the quantity of an item in the cart
router.post("/:userId/update", (req, res) => {
  const userId = req.params.userId;
  const { productId, quantity } = req.body;

  findOrCreateCart(userId, (err, cartId) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    db.run(
      "UPDATE cart_products SET quantity = ? WHERE cart_id = ? AND product_id = ?",
      [quantity, cartId, productId],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Cart updated", cartId: cartId });
      }
    );
  });
});

router.post("/:userId/remove", (req, res) => {
  const userId = req.params.userId;
  const { productId } = req.body;

  findOrCreateCart(userId, (err, cartId) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    db.run(
      "DELETE FROM cart_products WHERE cart_id = ? AND product_id = ?",
      [cartId, productId],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Product removed from cart", cartId: cartId });
      }
    );
  });
});

router.get("/:userId", (req, res) => {
  const userId = req.params.userId;

  findOrCreateCart(userId, (err, cartId) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    db.all(
      "SELECT p.*, cp.quantity FROM cart_products cp JOIN products p ON cp.product_id = p.id WHERE cp.cart_id = ?",
      [cartId],
      (err, items) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.json({ cartId: cartId, items: items });
      }
    );
  });
});

router.post("/:userId/checkout", (req, res) => {
  const userId = req.params.userId;

  findOrCreateCart(userId, (err, cartId) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    db.run(
      'UPDATE carts SET status = "purchased" WHERE id = ?',
      [cartId],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Checkout successful", cartId: cartId });
      }
    );
  });
});

module.exports = router;
