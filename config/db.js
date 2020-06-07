const mongoose = require("mongoose");
const config = require("config");
//Get Mongodb url by using get function
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log("Connteced to Mongodb database...");
  } catch (err) {
    console.error(err.message);
    // Exit if db connection processfails
    process.exit(1);
  }
};

module.exports = connectDB;
