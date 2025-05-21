import Swal from "sweetalert2";
import logo from "../assets/footer-logo.png";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
    });

    if (result.isConfirmed) {
      logout();
      navigate("/"); // Redirect to login page
      Swal.fire({
        icon: "success",
        title: "Logged Out",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const HomePage = () => {
    navigate("/home");
  };

  return (
    <header className="bg-blue-800 text-white p-4">
      <div className="flex flex-row items-center justify-between ">
        <div className="w-28">
          <img className="w-full h-full object-cover" src={logo} alt="logo" />
        </div>
        <div className="flex flex-row items-center gap-8 text-lg font-bold  ">
          <button onClick={HomePage} className="uppercase hover:underline">
            Home
          </button>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="text-xl font-bold hover:underline uppercase"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
