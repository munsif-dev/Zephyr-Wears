const uploadProductPermission = require("../../helpers/permission");
const productModel = require("../../models/productModel");

async function deleteProductController(req, res) {
  try {
    const { id } = req.params; // Correct destructuring here
    const deletedProduct = await productModel.findByIdAndDelete(id); // Use `productModel` here

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
}

module.exports = deleteProductController;
