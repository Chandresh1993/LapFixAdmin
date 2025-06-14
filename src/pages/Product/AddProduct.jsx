import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const location = useLocation();
  const id = location?.state?.id || "";

  const navigate = useNavigate();
  useEffect(() => {
    if (!id) {
      Swal.fire("Invalid Access", "SubCategory name not found.", "error");
      navigate("/");
    }
  }, [id, navigate]);

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setFormData((prev) => ({
        ...prev,
        subCategoryID: id,
      }));
    }
  }, [id]);

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

    const requiredFields = [
      "mainHeading",
      "name",
      "price",
      "quantity",
      "description",
      "howToInstallAndTips",
      "year",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        Swal.fire({
          icon: "warning",
          title: "Missing Field",
          text: `Please fill the "${field}" field.`,
        });
        return;
      }
    }

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    for (let i = 0; i < images.length; i++) {
      data.append("images", images[i]);
    }

    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_BASE_URL}/product`, data);
      Swal.fire({
        icon: "success",
        title: "Product Added",
        text: "The product has been created successfully!",
      });

      // Optionally reset form
      setFormData({
        mainHeading: "",
        name: "",
        price: "",
        discountPrice: "",
        quantity: "",
        description: "",
        howToInstallAndTips: "",
        year: "",
        subCategoryID: id,
      });
      setImages([]);
      setImagePreviews([]);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNumericKeyDown = (e) => {
    const allowedKeys = [
      "Backspace",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Delete",
    ];
    const isNumber = /^[0-9]$/.test(e.key);

    if (!isNumber && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full mx-auto p-8 bg-white shadow-lg mt-10 rounded">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 uppercase">
            Add New Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium">Heading</label>
              <input
                type="text"
                name="mainHeading"
                value={formData.mainHeading}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Product Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option disabled value="">
                  Year
                </option>
                {Array.from(
                  { length: new Date().getFullYear() - 1990 + 1 },
                  (_, i) => 1990 + i
                )
                  .reverse()
                  .map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Price</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                onKeyDown={handleNumericKeyDown}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400  outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Discount Price</label>
              <input
                type="text"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                onKeyDown={handleNumericKeyDown}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Quantity</label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                onKeyDown={handleNumericKeyDown}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

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
              <label className="block mb-1 font-medium">Upload Images</label>
              <input
                type="file"
                name="images"
                multiple
                onChange={handleImageChange}
                className="w-full px-4 py-2 border rounded-md"
              />

              {imagePreviews.length > 0 && (
                <div className="w-full flex flex-row justify-center">
                  <div className=" flex flex-col justify-center w-52 h-52 mt-4">
                    {imagePreviews.map((src, index) => (
                      <div
                        key={index}
                        className="border rounded overflow-hidden"
                      >
                        <img
                          src={src}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
            >
              Submit Product
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
