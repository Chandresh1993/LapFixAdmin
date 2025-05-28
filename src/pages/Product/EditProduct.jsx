import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

const EditProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state;
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [formData, setFormData] = useState({
    mainHeading: "",
    name: "",
    price: "",
    discountPrice: "",
    quantity: "",
    description: "",
    howToInstallAndTips: "",
    subCategoryID: "",
    year: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // 🔹 Fetch product by ID on mount
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/product/${id}`
        );
        const product = res.data;
        console.log(product, " productssss");

        setFormData({
          mainHeading: product.mainHeading,
          name: product.name,
          price: product.price,
          discountPrice: product.discountPrice,
          quantity: product.quantity,
          description: product.description,
          howToInstallAndTips: product.howToInstallAndTips,
          subCategoryID: product.subCategoryID?._id || "",
          year: product.year,
        });

        setImagePreviews(product.images || []);
      } catch (err) {
        Swal.fire("Error", "Failed to fetch product", "error");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/subCategory`
        );

        setSubCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch subcategories", err);
      } finally {
        setLoading(false);
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
    setSubmitLoading(true);

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
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleNumericKeyDown = (e) => {
    const allowed = ["Backspace", "ArrowLeft", "ArrowRight", "Tab", "Delete"];
    const isNumber = /^[0-9]$/.test(e.key);
    if (!isNumber && !allowed.includes(e.key)) e.preventDefault();
  };

  if (loading) {
    return <Loader />;
  }

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
              className="w-full px-4 py-2 text-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 font-medium">Product Year</label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="w-full px-4 py-2 border optional:text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            required
          >
            <option disabled value="">
              -- Select Year --
            </option>
            {Array.from({ length: 50 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Select Subcategory</label>
          <select
            name="subCategoryID"
            value={formData.subCategoryID}
            onChange={handleChange}
            className="w-full px-4 py-2 optional:text-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
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
            className="w-full px-4 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          className={`w-full py-2 rounded font-semibold text-white ${
            submitLoading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={submitLoading}
        >
          {submitLoading ? <Loader /> : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
