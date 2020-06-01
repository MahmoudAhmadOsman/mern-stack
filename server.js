const express = require("express");
const app = express();

app.get("/", function (req, res) {
  res.send("Welcome to Applebook");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
