import { useState } from "react";
import { api } from "../api/api";
import { Eye, EyeClosed } from "lucide-react";
import { Link } from "react-router-dom";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // <-- New state for success

  function validatePassword(password) {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long.";
    }
    if (!hasUppercase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasSymbol) {
      return "Password must contain at least one symbol.";
    }

    return ""; // no error
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setSuccess("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }

    try {
      const response = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
      });

      if (!response.success) {
        setError(response.error || "Registration failed");
        setSuccess("");
        return;
      }

      setError("");
      setSuccess("Registration successful! You can now log in.");

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.log("Registration error:", err);
      setError(err.message); // ✅ THIS IS THE FIX
      setSuccess("");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-sky-500 via-black to-sky-500 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[#05080E] rounded-xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-semibold text-white text-center">
          Create account
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Start managing your work
        </p>

        {/* Success message */}
        {success && (
          <div className="mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 text-center">
            {success}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-center">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {/* Name Fields */}
          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-xs font-medium text-gray-200 mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-sky-400 text-white"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-xs font-medium text-gray-200 mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-sky-400 text-white"
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Password */}
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
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-200 text-xs"
              >
                {showPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeClosed className="w-4 h-4" />
                )}
              </button>
            </div>
            {password && (
              <p className="text-xs mt-1 text-red-500">
                {validatePassword(password)}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-medium text-gray-200 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm pr-10
                  focus:outline-none focus:ring-2 focus:ring-sky-400 text-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-200 text-xs"
              >
                {showConfirmPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeClosed className="w-4 h-4" />
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
          Create Account
        </button>

        <p className="text-xs text-center text-gray-500 mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-sky-600 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
