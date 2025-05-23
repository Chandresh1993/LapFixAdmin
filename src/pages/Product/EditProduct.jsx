import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";

const EditProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state;
  const [subCategories, setSubCategories] = useState([]);

  const [formData, setFormData] = useState({
    mainHeading: "",
    name: "",
    price: "",
    discountPrice: "",
    quantity: "",
    description: "",
    howToInstallAndTips: "",
    subCategoryID: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // 🔹 Fetch product by ID on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/product/${id}`
        );
        const product = res.data;

        setFormData({
          mainHeading: product.mainHeading,
          name: product.name,
          price: product.price,
          discountPrice: product.discountPrice,
          quantity: product.quantity,
          description: product.description,
          howToInstallAndTips: product.howToInstallAndTips,
          subCategoryID: product.subCategoryID?._id || "",
        });

        setImagePreviews(product.images || []);
      } catch (err) {
        Swal.fire("Error", "Failed to fetch product", "error");
      }
    };

    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/subCategory`
        );

        setSubCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch subcategories", err);
      }
    };

    fetchSubCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    images.forEach((img) => data.append("images", img));

    try {
      await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/product/${id}`,
        data
      );
      Swal.fire("Success", "Product updated successfully", "success");
      navigate("/home"); // redirect after update
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Update failed",
        "error"
      );
    }
  };

  const handleNumericKeyDown = (e) => {
    const allowed = ["Backspace", "ArrowLeft", "ArrowRight", "Tab", "Delete"];
    const isNumber = /^[0-9]$/.test(e.key);
    if (!isNumber && !allowed.includes(e.key)) e.preventDefault();
  };

  return (
    <div className="w-full mx-auto p-8 bg-white shadow-lg mt-10 rounded">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 uppercase">
        Edit Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { label: " Heading", name: "mainHeading" },
          { label: "Product Name", name: "name" },
          { label: "Price", name: "price", numeric: true },
          { label: "Discount Price", name: "discountPrice", numeric: true },
          { label: "Quantity", name: "quantity", numeric: true },
        ].map(({ label, name, numeric }) => (
          <div key={name}>
            <label className="block mb-1 font-medium">{label}</label>
            <input
              type="text"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              onKeyDown={numeric ? handleNumericKeyDown : undefined}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Select Subcategory</label>
          <select
            name="subCategoryID"
            value={formData.subCategoryID}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            required
          >
            <option className="text-base " value="">
              -- Select Subcategory --
            </option>
            {subCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            How To Install & Tips
          </label>
          <textarea
            name="howToInstallAndTips"
            rows="3"
            value={formData.howToInstallAndTips}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Upload New Images</label>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {imagePreviews.length > 0 && (
          <div className="w-full flex flex-wrap justify-center gap-4 mt-4">
            {imagePreviews.map((src, index) => (
              <div
                key={index}
                className="w-40 h-40 border rounded overflow-hidden"
              >
                <img
                  src={src}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
