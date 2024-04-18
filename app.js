const express = require("express");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const app = express();
const port = process.env.PORT || 3000;
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/carts");
const signInRoutes = require("./routes/signin");

app.use(
  session({
    store: new SQLiteStore({ db: "mydb.sqlite3" }),
    secret: "csc-300x",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(express.json());
app.use("/api/carts", cartRoutes);
app.use("/api/users", userRoutes);
app.use("/api", productRoutes);
app.use("/api", signInRoutes);

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
