import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ViewProduct = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const [products, setProducts] = useState([]);

  const navigation = useNavigate();

  useEffect(() => {
    if (!id) return;
    fetchProductData();
  }, [id]);

  const fetchProductData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/product/products/${id}`
      );
      setProducts(res.data);
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      Swal.fire({
        icon: "error",
        title: "Fetch Failed",
        text: message,
      });
    }
  };

  const handleEdit = (id) => {
    navigation("/EditProducts", { state: { id } });
  };

  const handleDelete = async (productId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the product.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/product/${productId}`
        );
        setProducts(products.filter((p) => p._id !== productId));
        Swal.fire("Deleted!", "Product has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to delete product.", "error");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">View Products</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border-b">S.No</th>
              <th className="py-2 px-4 border-b ">Image</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Heading</th>

              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Discount</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product._id}
                className="text-sm text-gray-800 hover:bg-gray-50"
              >
                <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                <td className="py-2 px-4 border-b  flex items-center justify-center text-center">
                  <img
                    src={product.images[0]}
                    alt=""
                    className="w-36 h-16 object-cover rounded"
                  />
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {product.name}
                </td>
                <td className="py-2 px-4 border-b text-center ">
                  <p>{product.mainHeading}</p>
                </td>

                <td className="py-2 px-4 border-b text-center">
                  ₹{product.price}
                </td>
                <td
                  className="py-2 px-4 border-b text-center
                "
                >
                  ₹{product.discountPrice}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {product.quantity}
                </td>
                <td className="py-2 px-4 border-b">
                  <div
                    className="flex gap-2 justify-center
                  "
                  >
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewProduct;
