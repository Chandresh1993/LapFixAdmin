import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const SingleHeading = () => {
  const [Addheading, setAddHeading] = useState({ name: "" });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddHeading((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Addheading.name) {
      try {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/mainCategory`,
          Addheading
        );
        Swal.fire({
          icon: "success",
          title: "Add Heading",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/home");
        });
        window.dispatchEvent(new CustomEvent("heading-updated"));
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <p className="text-3xl text-center font-bold text-blue-700 uppercase">
          Add Heading
        </p>
      </div>

      <form>
        <label className="text-lg font-medium text-gray-700 ">
          Heading Name
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="name"
            placeholder="Enter the Heading"
            className="w-full py-2 px-2 outline-none rounded-md shadow-md"
            onChange={handleChange}
          ></input>
        </div>

        <div className="flex flex-row items-center justify-center">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition transform duration-150 ease-in-out active:scale-95 mt-4"
          >
            Add Heading
          </button>
        </div>
      </form>
    </div>
  );
};

export default SingleHeading;
