import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [heading, setHeading] = useState([]);

  const navigation = useNavigate();

  useEffect(() => {
    fetchHeading();
  }, []);

  const fetchHeading = async () => {
    try {
      const fetchData = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/firstCatgeory`
      );

      setHeading(fetchData.data);
    } catch (error) {
      let message =
        error.response && error.response.data && error.response.data.message;

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: message || "Something went wrong",
      });
    }
  };

  const AddHeading = () => {
    navigation("/Addheading");
  };

  const EditPage = (id) => {
    navigation(`/editheading/${id}`);
  };

  const deleteHeading = async (id) => {
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
          `${process.env.REACT_APP_BASE_URL}/firstCatgeory/${id}`
        );

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your heading has been deleted.",
          showConfirmButton: false,
          timer: 1500,
        });

        setHeading((prev) => prev.filter((item) => item._id !== id));

        window.dispatchEvent(new CustomEvent("heading-updated"));
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <p className="text-3xl text-center font-bold text-blue-700 uppercase">
          Heading Page
        </p>
      </div>

      <div className="flex flex-col items-end">
        <button
          onClick={AddHeading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition transform duration-150 ease-in-out active:scale-95"
        >
          Add Heading
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <div>
          {heading.map((value, index) => {
            return (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md mt-3"
              >
                <div className="flex items-center space-x-4">
                  <p className="text-gray-700 font-medium">{index + 1}</p>
                  <p className="text-gray-800 font-semibold">{value.name}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => EditPage(value._id)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteHeading(value._id)}
                    className="text-red-600 hover:underline font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
