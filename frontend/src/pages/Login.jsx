import { useState } from "react";
import { useUser } from "../context/UserContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(email, password);

    if (success) {
      setError("");
      navigate("/home");
    } else {
      setError("❌ Invalid credentials. Try again.");
    }
  };

  return (
    <div className="relative h-screen flex flex-col bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 overflow-hidden">
      <Navbar />

      {/* Floating decorations */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-24 -right-16 w-80 h-80 bg-white/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="flex-1 flex justify-center items-center px-4 relative z-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
            Login
          </h2>

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Username</span>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@email.com"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            />
          </label>

          <label className="block mb-6">
            <span className="text-gray-700 font-medium">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            />
          </label>

          {error && (
            <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Login
          </button>

          <p className="mt-4 text-center text-gray-800">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-purple-700 font-medium hover:underline"
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
