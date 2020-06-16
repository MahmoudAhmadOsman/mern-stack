const express = require("express");

//Bring db connection file
const connectDB = require("./config/db");
const app = express();

//Now, intialize/or call the connection string
connectDB();

//Users' Middleware
app.use(express.json()); // Enable later
//app.use(express.json({ extended: false }));

//Home page or Landing page
app.get("/", function (req, res) {
  res.send("Welcome to Applebook");
});

//ALL Routes
//Now, DEFINE all the routes you have in your app
//user.js, auth.js, profile.js, posts.js
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
