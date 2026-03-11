import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signUpUser,
  createBakerProfile,
  getCurrentUser,
} from "../utils/dataService";
import { useBakerAuth } from "../context/BakerAuthContext";
import { toast } from "react-toastify";

const BakerSignup = () => {
  const navigate = useNavigate();
  const { loginBaker } = useBakerAuth();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    shop_name: "",
    address: "",
    instagram: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateAuthForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!formData.shop_name.trim()) {
      newErrors.shop_name = "Shop name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (formData.instagram && !formData.instagram.match(/^@?[\w.]{1,30}$/)) {
      newErrors.instagram = "Invalid Instagram handle";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateAuthForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);

    try {
      const { user } = await signUpUser(formData.email, formData.password);

      if (!user) {
        throw new Error("Sign up failed");
      }

      toast.success("Account created! Now complete your baker profile.");
      setStep(2);
    } catch (error) {
      console.error("Error signing up:", error);
      if (error.message.includes("already registered")) {
        toast.error(
          "This email is already registered. Please sign in instead.",
        );
      } else {
        toast.error(
          error.message || "Failed to create account. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);

    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const bakerProfile = await createBakerProfile({
        shop_name: formData.shop_name,
        address: formData.address,
        instagram: formData.instagram,
      });

      loginBaker(bakerProfile);
      toast.success("Baker profile created successfully!");
      navigate(`/baker-profile/${bakerProfile.id}`);
    } catch (error) {
      console.error("Error creating baker profile:", error);
      toast.error(
        error.message || "Failed to create baker profile. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8 mb-20 lg:mb-0">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">
            🍰 Create Your Stall
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Start selling your delicious bakery products
          </p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="At least 6 characters"
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Repeat your password"
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "⏳ Creating Stall..." : "🚀 Create Stall"}
            </button>

            <p className="text-center text-gray-600 text-sm mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Go back
              </button>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8 mb-20 lg:mb-0">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">
          🏪 Complete Your Profile
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Tell us about your bakery
        </p>

        <form onSubmit={handleCreateProfile} className="space-y-4">
          {/* Shop Name */}
          <div>
            <label
              htmlFor="shop_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Shop Name *
            </label>
            <input
              id="shop_name"
              name="shop_name"
              type="text"
              value={formData.shop_name}
              onChange={handleInputChange}
              placeholder="e.g. Sweet Dreams Bakery"
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.shop_name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.shop_name && (
              <p className="text-red-500 text-sm mt-1">{errors.shop_name}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Address *
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter your shop address"
              rows="3"
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* Instagram */}
          <div>
            <label
              htmlFor="instagram"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Instagram Handle (Optional)
            </label>
            <input
              id="instagram"
              name="instagram"
              type="text"
              value={formData.instagram}
              onChange={handleInputChange}
              placeholder="@yourbakery or yourbakery"
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.instagram ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.instagram && (
              <p className="text-red-500 text-sm mt-1">{errors.instagram}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? "⏳ Setting Up..." : "✅ Complete & Launch"}
          </button>

          <p className="text-center text-gray-600 text-sm mt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Back to account setup
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default BakerSignup;
