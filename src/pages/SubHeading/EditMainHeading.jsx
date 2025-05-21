import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Swal from "sweetalert2";

const EditMainHeading = () => {
  const [subheading, setHeading] = useState({ name: "", mainCategoryId: {} });
  const [mainCategories, setMainCategories] = useState([]);

  const location = useLocation();

  const { id } = location.state || {};

  useEffect(() => {
    fetchSubHeading();
    fetchMainCategories();
  }, [id]);

  const fetchSubHeading = async () => {
    if (id) {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/subCategory/${id}`
        );
        setHeading(res.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Fetch Failed",
          text:
            (error.response && error.response.data?.message) ||
            "Something went wrong",
        });
      }
    }
  };

  const fetchMainCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/mainCategory`
      );
      setMainCategories(res.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Fetch Failed",
        text:
          (error.response && error.response.data?.message) ||
          "Something went wrong",
      });
    }
  };

  const handleMainCategoryChange = (e) => {
    const selectedId = e.target.value;
    const selectedCategory = mainCategories.find(
      (cat) => cat._id === selectedId
    );
    setHeading((prev) => ({
      ...prev,
      mainCategoryId: selectedCategory,
    }));
  };

  const onClickHandle = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: subheading.name,
        mainCategoryId: subheading.mainCategoryId._id,
      };

      await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/subCategory/${id}`,
        payload
      );

      Swal.fire({
        icon: "success",
        title: "Updated Successfully",
        text: "Subheading has been updated.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          (error.response && error.response.data?.message) ||
          "Something went wrong",
      });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <p className="text-3xl text-center font-bold text-blue-700 uppercase">
          Edit Sub Heading
        </p>
      </div>

      <form>
        <label className="text-lg font-medium text-gray-700 uppercase">
          Sub Heading Name Edit
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="name"
            value={subheading.name}
            placeholder="Enter the Heading"
            className="w-full py-2 px-2 outline-none rounded-md shadow-md"
            onChange={(e) =>
              setHeading({ ...subheading, name: e.target.value })
            }
          />
        </div>

        <div className="mt-5">
          <label className="text-lg font-medium text-gray-700 uppercase">
            Main Heading Name Edit
          </label>
          <div className="mt-2">
            <select
              name="mainCategoryId"
              value={subheading.mainCategoryId?._id || ""}
              onChange={handleMainCategoryChange}
              className="w-full py-2 px-2 bg-wh outline-none rounded-md shadow-md"
            >
              <option value="">Select Main Category</option>
              {mainCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-row items-center justify-center">
          <button
            onClick={onClickHandle}
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition transform duration-150 ease-in-out active:scale-95 mt-4 uppercase"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMainHeading;
