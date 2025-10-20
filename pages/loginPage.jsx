import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import Header from "../components/navBar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  console.log(import.meta.env.VITE_BACKEND_URL);

  // 🔹 Live validation
  const validateEmail = (value) => {
    if (!value) return "Email is required.";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) return "Enter a valid email address.";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required.";
    if (value.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  // 🔹 Handle input changes with live validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
  };

  function login() {
    // ======= Validate before submit =======
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) {
      toast.error("Please correct the highlighted fields.");
      return;
    }

    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/users/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.data.user == null) {
          toast.error(res.data.message);
          return;
        }
        toast.success("Login Success");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // Get redirect param
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect");

        if (redirect) {
          if (res.data.user.type === "customer") {
            window.location.href = redirect; // Only customers can adopt
          } else {
            toast.error("Only customers can adopt a pet.");
            window.location.href = "/"; // redirect them home
          }
        } else if (res.data.user.type === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Login failed. Please try again.");
      });
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-200 via-white to-blue-200">
      {/* 🔹 Header */}
      <Header />

      <div className="flex flex-grow items-center justify-center p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden bg-white">
          
          {/* Left Section - Form */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-10 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">WELCOME TO</h1>
            <h2 className="text-2xl font-semibold text-green-600 mb-6">CENTRAL PET CARE</h2>
            <p className="text-gray-500 mb-8">
              We offer expert pet training, high-quality food, and everything your pet needs to stay happy and healthy.
            </p>

            {/* Email */}
            <input
              value={email}
              onChange={handleEmailChange}
              type="text"
              placeholder="Email"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email ? "border-red-400" : "border-gray-200"
              } bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-1`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-3">{errors.email}</p>
            )}

            {/* Password */}
            <input
              value={password}
              onChange={handlePasswordChange}
              type="password"
              placeholder="Password"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.password ? "border-red-400" : "border-gray-200"
              } bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-1`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mb-3">{errors.password}</p>
            )}

            {/* Remember Me */}
            <div className="flex items-center mb-4">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-gray-600 text-sm">
                Remember me
              </label>
            </div>

            {/* Login Button */}
            <button
              onClick={login}
              className="w-full bg-purple-700 text-white py-3 rounded-lg shadow-md hover:bg-purple-800 transition"
            >
              Login
            </button>

            {/* Register link */}
            <p className="text-sm text-gray-500 mt-4">
              Don’t have an account?{" "}
              <a href="/register" className="text-purple-700 font-semibold hover:underline">
                Register here
              </a>
            </p>
          </div>

          {/* Right Section - Image with smaller bottom overlay */}
          <div className="relative bg-gradient-to-br from-blue-100 via-blue-200 to-blue-100 flex justify-center items-center p-6">
            {/* Bigger Puppy Image */}
            <img
              src="https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/dog01.jpg" 
              alt="Puppy"
              className="max-h-[500px] object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
