import { Link, useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { useUser } from "../context/UserContext";

export default function Navbar() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center p-6 bg-gray-800 text-white">
      {/* Logo and DataCent name clickable */}
      <Link to="/" className="flex items-center space-x-2 hover:opacity-90">
        <img src="/logo.png" alt="DataCent Logo" className="h-10 w-10" />
        <div className="text-xl font-bold">DataCent</div>
      </Link>

      {/* Navigation links */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        {user.isLoggedIn ? (
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="hover:underline"
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="hover:underline">Login</Link>
        )}
        <Link to="/projects">
          <Button>Create Global Network</Button>
        </Link>
      </div>
    </nav>
  );
}
