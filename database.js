const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

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

function getCategoryIdByName(categoryName, callback) {
  db.get(
    "SELECT id FROM categories WHERE name = ?",
    [categoryName],
    (err, row) => {
      if (err) {
        callback(err);
      } else if (row) {
        callback(null, row.id);
      } else {
        callback(new Error("Category not found"));
      }
    }
  );
}

function bulkUploadProducts(filePath, callback) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return callback(err);
    }

    let products;
    try {
      const json = JSON.parse(data);
      if (!json.products || !Array.isArray(json.products)) {
        throw new Error("Invalid JSON format for products");
      }
      products = json.products;
    } catch (parseErr) {
      return callback(parseErr);
    }

    db.serialize(() => {
      db.run("BEGIN TRANSACTION;");

      const insertStmt = db.prepare(
        "INSERT INTO products (name, description, category_id, image_url, price, is_featured) VALUES (?, ?, ?, ?, ?, ?)"
      );

      products.forEach((product, index) => {
        getCategoryIdByName(product.category, (err, categoryId) => {
          if (err) {
            db.run("ROLLBACK;", () => {
              callback(err);
            });
            return;
          }

          insertStmt.run(
            [
              product.name,
              product.description,
              categoryId,
              product.imagePath,
              product.price,
              product.is_featured || 0,
            ],
            (insertErr) => {
              if (insertErr) {
                db.run("ROLLBACK;", () => {
                  callback(insertErr);
                  return;
                });
              }
              if (index === products.length - 1) {
                insertStmt.finalize();
                db.run("COMMIT;", () => {
                  callback(null, { inserted: products.length });
                });
              }
            }
          );
        });
      });
    });
  });
}

//const filePath =
//"c:/Users/aimad/OneDrive/300x/TermProject/YacoubasFurniture/public/bulkupload.json";
//bulkUploadProducts(filePath, (err, result) => {
//if (err) {
// console.log("Bulk upload error:", err.message);
//} else {
// console.log("Bulk upload success:", result);
//}
//});

function getProductsByCategoryId(categoryId, callback) {
  const sql = "SELECT * FROM products WHERE category_id = ?";
  db.all(sql, [categoryId], function (err, rows) {
    if (err) {
      callback(err);
    } else {
      callback(null, rows);
    }
  });
}

function getAllCategories(callback) {
  db.all("SELECT * FROM categories", (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}

function updateProduct(id, productData, callback) {
  const { name, description, category_id, image_url, price } = productData;
  const sql = `UPDATE products SET name = ?, description = ?, category_id = ?, image_url = ?, price = ? WHERE id = ?`;
  db.run(
    sql,
    [name, description, category_id, image_url, price, id],
    function (err) {
      if (err) {
        callback(err);
      } else {
        callback(null, { id: this.lastID, changes: this.changes });
      }
    }
  );
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
  getProductsByCategoryId,
  getAllCategories,
  updateProduct,
  bulkUploadProducts,
};

process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Closed the database connection.");
    process.exit(0);
  });
});
