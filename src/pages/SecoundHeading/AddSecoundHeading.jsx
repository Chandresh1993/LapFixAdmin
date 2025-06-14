import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddSecoundHeading = () => {
  const [headingData, setHeadingData] = useState({
    name: "",
    mainCategories: [],
  });
  const [data, setData] = useState({ name: "" });
  const navigation = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};

  const getByIdHeading = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/firstCatgeory/${id}`
      );
      setHeadingData(response.data);
    } catch (error) {
      let message =
        error.response && error.response.data && error.response.data.message;
      Swal.fire({
        icon: "error",
        title: "Single get heading error",
        text: message,
      });
    }
  };

  useEffect(() => {
    if (id) getByIdHeading(id); // only call if id exists
  }, [id]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleOnClick = async (e) => {
    e.preventDefault();

    if (data.name) {
      let createData = {
        name: data.name,
        firstCategoryId: id,
      };

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/mainCategory`,
          createData
        );

        const newSubCategory = response.data;

        setHeadingData((prev) => ({
          ...prev,
          mainCategories: [...prev.mainCategories, newSubCategory],
        }));

        // Re-fetch full list
        await getByIdHeading(id);
        // ✅ Optionally clear the input field
        setData({ name: "" });

        Swal.fire({
          icon: "success",
          title: "Add Sub -Heading",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        let message =
          error.response && error.response.data && error.response.data.message;

        Swal.fire({
          icon: "error",
          title: "Error",
          text: message,
        });
      }
    }
  };

  const handleOnEdit = (id) => {
    navigation(`/editSecoundHeading`, { state: { id } });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Deleting this category ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/mainCategory/${id}`
        );

        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your subheading has been deleted.",
          timer: 1500,
          showConfirmButton: false,
        });

        // Remove deleted item from state
        setHeadingData((prev) => ({
          ...prev,
          mainCategories: prev.mainCategories.filter(
            (value) => value._id !== id
          ),
        }));
      } catch (error) {
        let message = error.response?.data?.message || "Something went wrong";
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: message,
        });
      }
    }
  };

  const handleNavigation = (id) => {
    navigation(`/addsubHeading/${id}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <p className="text-3xl text-center font-bold text-blue-700 uppercase">
          Add Sub Heading
        </p>
      </div>

      <div>
        <p className="text-xl font-semibold text-blue-500 uppercase">
          {headingData.name}
        </p>
      </div>
      <form className="mt-3">
        <label className="text-lg font-medium text-gray-700 uppercase ">
          Sub Heading Name
        </label>

        <div className="mt-2">
          <input
            onChange={handleChange}
            type="text"
            name="name"
            value={data.name}
            placeholder="Enter the Heading"
            className="w-full py-2 px-2 outline-none rounded-md shadow-md"
          ></input>
        </div>

        <div className="flex flex-row items-center justify-center">
          <button
            onClick={handleOnClick}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition transform duration-150 ease-in-out active:scale-95 mt-4 uppercase"
          >
            Submit
          </button>
        </div>
      </form>

      <div>
        {headingData.mainCategories.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-lg font-medium text-gray-700 mb-2 uppercase">
              Sub Categories
            </p>

            {/* Table-style headers */}
            <div className="flex font-semibold text-gray-800 border-b pb-2"></div>

            {headingData.mainCategories.map((sub, index) => (
              <div
                key={sub._id}
                className="flex items-center justify-between px-2 py-2 bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 rounded-md shadow-sm transition"
              >
                <div className="w-1/12 text-center">{index + 1}</div>
                <div className="w-6/12">{sub.name}</div>
                <div className="w-5/12 flex justify-end space-x-4">
                  <button
                    onClick={() => handleNavigation(sub._id)}
                    className="text-green-600 hover:underline font-medium"
                  >
                    Add Child Category
                  </button>

                  <button
                    onClick={() => handleOnEdit(sub._id)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(sub._id)}
                    className="text-red-600 hover:underline font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddSecoundHeading;
