import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import Header from "../components/navBar";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "customer",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ level: "", color: "" });

  // ✅ Password strength checker
  function checkPasswordStrength(password) {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++; // special character

    if (score === 0) return { level: "", color: "" };
    if (score === 1) return { level: "Weak", color: "bg-red-500" };
    if (score === 2) return { level: "Fair", color: "bg-yellow-500" };
    if (score === 3) return { level: "Good", color: "bg-blue-500" };
    if (score >= 4) return { level: "Strong", color: "bg-green-500" };
  }

  // ✅ Validate fields as user types
  function validateField(name, value) {
    let error = "";

    switch (name) {
          case "firstName":
        if (!value.trim()) error = "First name is required.";
        else if (/\d/.test(value)) error = "First name cannot contain numbers.";
        break;
      case "lastName":
        if (!value.trim()) error = "Last name is required.";
        else if (/\d/.test(value)) error = "Last name cannot contain numbers.";
        break;

      case "email":
  if (!value.trim()) error = "Email is required.";
  else if (
    !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)
  )
    error = "Enter a valid email address.";
  break;

      case "password":
        if (value.length < 6) error = "Password must be at least 6 characters.";
        break;
      case "confirmPassword":
        if (value !== form.password) error = "Passwords do not match.";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  }

  async function register() {
    // Final check before sending
    Object.keys(form).forEach((key) => validateField(key, form[key]));
    if (
      Object.values(errors).some((err) => err) ||
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/users/register",
        {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          type: form.userType,
        }
      );

     if (res.data.success) {
  toast.success("Registration successful! Redirecting...");
  setTimeout(() => {
    window.location.href = "/";
  }, 1500);
} else if (
  res.data.message &&
  res.data.message.toLowerCase().includes("email")
) {
  toast.error("You’ve already used this email.");
} else {
  toast.error(res.data.message || "Registration failed.");
}

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-200 via-white to-blue-200">
      <Header />

      <div className="flex flex-grow items-center justify-center p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden bg-white">
          
          {/* Left Section - Form */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-10 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">CREATE ACCOUNT</h1>
            <h2 className="text-2xl font-semibold text-green-600 mb-6">CENTRAL PET CARE</h2>
            <p className="text-gray-500 mb-8">Join our community and give pets a better life ❤️</p>

            {/* First Name */}
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              type="text"
              placeholder="First Name"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 mb-1"
            />
            {errors.firstName && <p className="text-red-500 text-sm mb-3">{errors.firstName}</p>}

            {/* Last Name */}
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              type="text"
              placeholder="Last Name"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 mb-1"
            />
            {errors.lastName && <p className="text-red-500 text-sm mb-3">{errors.lastName}</p>}

            {/* Email */}
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 mb-1"
            />
            {errors.email && <p className="text-red-500 text-sm mb-3">{errors.email}</p>}

            {/* Password */}
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 mb-1"
            />
            {errors.password && <p className="text-red-500 text-sm mb-1">{errors.password}</p>}

            {/* Password Strength Bar */}
            {form.password && (
              <div className="mb-3">
                <div className="h-2 rounded-full bg-gray-200 w-full">
                  <div
                    className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                    style={{
                      width:
                        passwordStrength.level === "Weak"
                          ? "25%"
                          : passwordStrength.level === "Fair"
                          ? "50%"
                          : passwordStrength.level === "Good"
                          ? "75%"
                          : passwordStrength.level === "Strong"
                          ? "100%"
                          : "0%",
                    }}
                  />
                </div>
                <p className={`text-xs mt-1 font-medium ${passwordStrength.color.replace("bg-", "text-")}`}>
                  {passwordStrength.level}
                </p>
              </div>
            )}

            {/* Confirm Password */}
            <input
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 mb-1"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mb-3">{errors.confirmPassword}</p>}

            {/* User Type */}
            <select
              name="userType"
              value={form.userType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 mb-4"
            >
              <option value="customer">Customer</option>
              <option value="admin">Staff</option>
            </select>

            {/* Register Button */}
            <button
              onClick={register}
              disabled={loading}
              className={`w-full py-3 rounded-lg shadow-md transition text-white ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-800"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            {/* Link to Login */}
            <p className="text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-purple-700 font-semibold hover:underline">
                Login here
              </a>
            </p>
          </div>

          {/* Right Section - Image */}
          <div className="relative bg-gradient-to-br from-blue-100 via-blue-200 to-blue-100 flex justify-center items-center p-6">
            <img
              src="https://i.pinimg.com/736x/32/dc/5a/32dc5ae68be64ae4ed325a04208e3aed.jpg"
              alt="Register Puppy"
              className="max-h-[500px] object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
