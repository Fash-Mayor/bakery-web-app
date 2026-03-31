import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBakerProfile, getCurrentUser } from "../utils/dataService";
import { useBakerAuth } from "../context/BakerAuthContext";
import { toast } from "react-toastify";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { loginBaker } = useBakerAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [formData, setFormData] = useState({
    shop_name: "",
    address: "",
    instagram: "",
  });

  const validateProfileForm = () => {
    const newErrors = {};
    if (!formData.shop_name.trim()) newErrors.shop_name = "Shop name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (formData.instagram && !formData.instagram.match(/^@?[\w.]{1,30}$/)) {
      newErrors.instagram = "Invalid Instagram handle";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    setLoading(true);
    try {
      const user = await getCurrentUser();
      
      // If Supabase returns no user/session
      if (!user) {
        setAuthError("Session expired or email not verified. Please login again.");
        setLoading(false);
        return;
      }

      const bakerProfile = await createBakerProfile({
        shop_name: formData.shop_name,
        address: formData.address,
        instagram: formData.instagram,
        user_id: user.id // Ensure you are passing the ID explicitly
      });

      loginBaker(bakerProfile);
      toast.success("Stall is live!");
      navigate(`/baker-profile/${bakerProfile.id}`);
    } catch (error) {
      console.error("Profile Error:", error);
      toast.error("Could not create profile. Make sure your email is verified.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8 mb-20 lg:mb-0">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">🏪 Complete Your Profile</h1>
        <p className="text-center text-gray-600 mb-8">Tell us about your bakery</p>

        <form onSubmit={handleCreateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name *</label>
            <input
              name="shop_name"
              type="text"
              value={formData.shop_name}
              onChange={handleInputChange}
              placeholder="e.g. Sweet Dreams Bakery"
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.shop_name ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.shop_name && <p className="text-red-500 text-sm mt-1">{errors.shop_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter your shop address"
              rows="3"
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${errors.address ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Handle (Optional)</label>
            <input
              name="instagram"
              type="text"
              value={formData.instagram}
              onChange={handleInputChange}
              placeholder="@yourbakery"
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.instagram ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.instagram && <p className="text-red-500 text-sm mt-1">{errors.instagram}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition shadow-lg mt-6 disabled:opacity-50"
          >
            {loading ? "⏳ Setting Up..." : "✅ Complete & Launch"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;