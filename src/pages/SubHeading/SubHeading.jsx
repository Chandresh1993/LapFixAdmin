import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SubHeading = () => {
  const navigation = useNavigate();
  const [subHeading, setSubHeading] = useState([]);

  useEffect(() => {
    fetchsubHeading();
  }, []);

  const fetchsubHeading = async () => {
    try {
      const fetchData = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/subCategory`
      );
      setSubHeading(fetchData.data);
    } catch (error) {
      let message =
        error.response && error.response.data && error.response.data.message;

      Swal.fire({
        icon: "error",
        title: "Fetch Failed",
        text: message || "Something went wrong",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/subCategory/${id}`
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
        setSubHeading((prev) => prev.filter((value) => value._id !== id));
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

  const handleOnEdit = (id) => {
    navigation(`/EditsubHeading/${id}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <p className="text-3xl text-center font-bold text-blue-700 uppercase">
          Sub Heading Page
        </p>
      </div>

      <div className="flex flex-col items-end mb-4">
        <p className="text-sm text-gray-600">
          To add a subheading, please click on{" "}
          <span className="font-medium text-blue-700">Main Heading</span>.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {subHeading.length > 0 ? (
          subHeading.map((item, index) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <p className="text-gray-700 font-medium">{index + 1}.</p>
                <p className="text-gray-800 font-semibold">{item.name}</p>
                {item.mainCategoryId && (
                  <p className="text-gray-700 text-base">
                    ({item.mainCategoryId.name})
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleOnEdit(item._id)}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-600 hover:underline font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No subheadings found.</p>
        )}
      </div>
    </div>
  );
};

export default SubHeading;
