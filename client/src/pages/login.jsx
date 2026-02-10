import { useState } from "react";
import { api } from "../api/api";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!response.success) {
        setError("Invalid email or password");

        return;
      }

      setError("");
      if (response.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-sky-500 via-black to-sky-500 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[#05080E] rounded-xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-semibold text-white text-center">
          Welcome back
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Sign in to your account
        </p>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-center">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-sky-400 text-white"
            />
          </div>

          {/* Password with eye icon */}
          <div>
            <label className="block text-xs font-medium text-gray-200 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm pr-10
                  focus:outline-none focus:ring-2 focus:ring-sky-400 text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-200"
              >
                {showPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-sky-500 text-white py-2.5 rounded-md text-sm font-medium
            hover:bg-sky-600 active:scale-[0.98] transition"
        >
          Sign In
        </button>

        <p className="text-xs text-center text-gray-500 mt-5">
          Don’t have an account?
          <Link
            to="/register"
            className="text-sky-600 font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
