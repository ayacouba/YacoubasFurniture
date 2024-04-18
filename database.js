const sqlite3 = require("sqlite3").verbose();

// Create a new database instance
let db = new sqlite3.Database(
  "./mydb.sqlite3",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the SQLite database.");
  }
);

// Function to find a user by email
function findUser(email, callback) {
  db.get("SELECT * FROM users WHERE email = ?", [email], function (err, row) {
    if (err) {
      callback(err);
    } else {
      callback(null, row);
    }
  });
}

function getAllProducts(callback) {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      callback(err);
    } else {
      callback(null, rows);
    }
  });
}

function getProductById(id, callback) {
  db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
    callback(err, row);
  });
}
module.exports = {
  db,
  findUser,
  getAllProducts,
  getProductById,
};

// Close the database connection when the Node.js process ends
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Closed the database connection.");
    process.exit(0);
  });
});
