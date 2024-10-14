import React, { useState } from "react";
import { MdModeEditOutline, MdDelete } from "react-icons/md"; // Added MdDelete for delete icon
import AdminEditProduct from "./AdminEditProduct";
import displayINRCurrency from "../helpers/displayCurrency";

const AdminProductCard = ({ data, fetchdata }) => {
  const [editProduct, setEditProduct] = useState(false);
  const [loading, setLoading] = useState(false); // Add a loading state for delete action

  const deleteProduct = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/${data._id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("Product deleted successfully");
          fetchdata(); // Refresh the product list after deletion
        } else {
          alert("Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("An error occurred while deleting the product");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded ">
      <div className="w-40">
        <div className="w-32 h-32 flex justify-center items-center">
          <img
            src={data?.productImage[0]}
            className="mx-auto object-fill h-full"
            alt="Product"
          />
        </div>
        <h1 className="text-ellipsis line-clamp-2">{data.productName}</h1>
        <div>
          <p className="font-semibold">
            {displayINRCurrency(data.sellingPrice)}
          </p>
          <div className="flex justify-between">
            <div
              className="w-fit p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer"
              onClick={() => setEditProduct(true)}
            >
              <MdModeEditOutline />
            </div>
            <div
              className="w-fit p-2 bg-red-100 hover:bg-red-600 rounded-full hover:text-white cursor-pointer"
              onClick={deleteProduct}
            >
              {loading ? "Deleting..." : <MdDelete />}
            </div>
          </div>
        </div>
      </div>
      {editProduct && (
        <AdminEditProduct
          productData={data}
          onClose={() => setEditProduct(false)}
          fetchdata={fetchdata}
        />
      )}
    </div>
  );
};

export default AdminProductCard;
