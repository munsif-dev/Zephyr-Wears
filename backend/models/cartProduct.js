const mongoose = require("mongoose");

const addToCart = mongoose.Schema(
  {
    productId: {
      ref: "product",
      // Usage of ref: Mongoose Population feature
      // By setting up ref: 'product', you enable Mongoose population, which allows you to automatically retrieve the referenced Product document when you query the addToCart collection. For example, you can use .populate('productId') in a query to fetch the full product details (instead of just having the productId string).
      type: String,
    },
    quantity: Number,
    userId: String,
  },
  {
    timestamps: true,
  }
);

const addToCartModel = mongoose.model("addToCart", addToCart);

module.exports = addToCartModel;
