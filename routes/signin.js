const express = require("express");
const db = require("../database");
const router = express.Router();

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  // Query the database for the user
  db.findUser(email, (err, user) => {
    if (err) {
      res.status(500).send("Error on the server.");
    } else if (!user) {
      res.status(404).send("No user found.");
    } else {
      if (password === user.password) {
        req.session.userId = user.id;
        req.session.userName = user.name;
        req.session.userType = user.user_type;
        res.json({
          message: "Authentication successful",
          userId: user.id,
          name: user.name,
          userType: user.user_type,
        });
      } else {
        res.status(401).send("Authentication failed.");
      }
    }
  });
});

module.exports = router;
