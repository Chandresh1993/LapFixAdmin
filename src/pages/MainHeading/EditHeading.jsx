import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const EditHeading = () => {
  const { id } = useParams();

  const navigation = useNavigate();

  const [headingData, setHeadingData] = useState({ name: "" });

  useEffect(() => {
    const getByIdHeading = async (id) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/mainCategory/${id}`
        );
        setHeadingData(response.data);
      } catch (error) {
        let message =
          error.response && error.response.data && error.response.data.message;
        Swal.fire({
          icon: "error",
          title: "Singel get heading error",
          text: message,
        });
      }
    };

    getByIdHeading(id);
  }, [id]);

  const handleOnchange = (e) => {
    setHeadingData({ ...headingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/mainCategory/${id}`,
        headingData
      );

      console.log(data, " dataa");
      Swal.fire({
        icon: "success",
        title: "Edit Heading",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigation("/home");
      });

      window.dispatchEvent(new CustomEvent("heading-updated"));
    } catch (error) {
      let message =
        error.response && error.response.data && error.response.data.message;
      Swal.fire({
        icon: "error",
        title: "update to heading error",
        text: message,
      });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <p className="text-3xl text-center font-bold text-blue-700 uppercase">
          Edit Heading
        </p>
      </div>

      <form>
        <label className="text-lg font-medium text-gray-700 uppercase ">
          Heading Name
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="name"
            value={headingData.name}
            onChange={handleOnchange}
            placeholder="Enter the Heading"
            className="w-full py-2 px-2 outline-none rounded-md shadow-md"
          ></input>
        </div>

        <div className="flex flex-row items-center justify-center">
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition transform duration-150 ease-in-out active:scale-95 mt-4 uppercase"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditHeading;
