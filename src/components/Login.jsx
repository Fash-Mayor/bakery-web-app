import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBakerAuth } from "../context/BakerAuthContext";
// toast is kept only if you still want the success message, otherwise you can remove it entirely
import { toast } from "react-toastify"; 
import { FaArrowLeft } from "react-icons/fa";
import { supabase } from '../utils/dataService';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { fetchBakerProfile } from "../utils/dataService";

const Login = () => {
  const navigate = useNavigate();
  const { loginBaker } = useBakerAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    // Clear previous overall auth errors when trying again
    setAuthError("");
    
    // Basic validation before hitting the server
    if (!email || !password) {
      setErrors({
        email: !email ? "Email is required" : "",
        password: !password ? "Password is required" : ""
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if the baker actually has a profile setup in the DB
      const profile = await fetchBakerProfile(data.user.id);

      // Update local Auth Context
      if (loginBaker) await loginBaker(profile || data.user);

      toast.success("Welcome back!");

      // If no profile exists, navigate to setup, otherwise go to dashboard
      if (!profile) {
        navigate("/complete-profile");
      } else {
        navigate(`/baker-profile/${data.user.id}`);
      }

    } catch (error) {
      let friendlyMessage = "Something went wrong. Please try again.";
      const devMessage = error.message || "";

      // Mapping Supabase errors to user-friendly messages
      if (devMessage === "Invalid login credentials") {
        friendlyMessage = "Invalid email or password. Please try again.";
      } else if (devMessage.includes("Email not confirmed")) {
        friendlyMessage = "Please verify your email before logging in.";
      } else if (devMessage.toLowerCase().includes("rate limit")) {
        friendlyMessage = "Too many attempts. Please try again in a few minutes.";
      } else if (devMessage.includes("Failed to fetch")) {
        friendlyMessage = "Network error. Please check your internet connection.";
      }

      // Set the error state so the red UI box appears
      setAuthError(friendlyMessage);
      console.error("Auth Error:", devMessage);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8 mb-20 lg:mb-0">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8 font-medium transition"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-orange-100">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your baker account</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                disabled={loading}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                  if (authError) setAuthError(""); // Clear global error on typing
                }}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                disabled={loading}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                  if (authError) setAuthError(""); // Clear global error on typing
                }}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword ? (
                  <IoEyeOffOutline size={22} />
                ) : (
                  <IoEyeOutline size={22} />
                )}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Red UI Error Message Box */}
            {authError && (
              <div className="p-4 mt-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <span className="text-red-600 text-sm font-medium">{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-md"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/become-baker")}
            className="w-full border-2 border-orange-500 text-orange-600 font-semibold py-3 rounded-lg hover:bg-orange-50 transition"
          >
            Create a Stall
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;