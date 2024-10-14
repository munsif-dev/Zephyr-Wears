const mongoose = require("mongoose");
//This imports Mongoose, a popular MongoDB object data modeling(ODM) library, which allows you to interact with a MongoDB database using JavaScript.

async function connectDB() {
  // Declares an asynchronous function named connectDB, which will handle the database connection.
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    // mongoose.connect() establishes a connection to the MongoDB database.
    // process.env.MONGODB_URI retrieves the MongoDB connection URI from the environment variables (stored in the .env file).
    // await ensures that the function waits until the database connection is established before continuing.
  } catch (err) {
    console.log(err);
    // catch (err): If there is an error during the connection, it is caught and logged to the console with console.log(err);.
  }
}

module.exports = connectDB;
