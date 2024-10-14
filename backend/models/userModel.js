const mongoose = require("mongoose");
// Mongoose is used to create and manage MongoDB collections using schemas that define the structure of documents in the database.

// what is collection and what is document in MongoDB?

const userSchema = new mongoose.Schema(
  // a schema for the User model, which determines how user documents will be structured in MongoDB.
  {
    name: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: String,
    profilePic: String,
    role: String,
  },
  {
    timestamps: true,
    //   timestamps: true: Automatically adds createdAt and updatedAt fields to each document, which store the creation and last update times.
  }
);

const userModel = mongoose.model("user", userSchema);
// "user": The name of the model (MongoDB will create a collection called users for this model, as Mongoose automatically pluralizes the name). Simply the name of the collection

module.exports = userModel;
