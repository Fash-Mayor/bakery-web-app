import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchBakerProfile,
  fetchBakerProducts,
  uploadProduct,
  updateBakerProfile,
  uploadImage,
} from "../utils/dataService";
import { useBakerAuth } from "../context/BakerAuthContext";
import { toast } from "react-toastify";
import { FaEdit, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import ProductCard from "./ProductCard";

const BakerProfile = () => {
  const { bakerId } = useParams();
  const navigate = useNavigate();
  const { baker: loggedInBaker } = useBakerAuth();

  const [bakerData, setBakerData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    ingredients: "",
    allergens: "",
    image1_url: "",
    image2_url: "",
  });

  const [productImageFiles, setProductImageFiles] = useState({
    image1: null,
    image2: null,
  });

  const [uploadingImages, setUploadingImages] = useState(false);
  const isOwnProfile = loggedInBaker && loggedInBaker.id === bakerId;

  useEffect(() => {
    const loadBakerData = async () => {
      try {
        setLoading(true);
        const baker = await fetchBakerProfile(bakerId);
        setBakerData(baker);
        setEditFormData(baker);

        const bakerProducts = await fetchBakerProducts(bakerId);
        setProducts(bakerProducts);
      } catch (error) {
        console.error("Error loading baker data:", error);
        toast.error("Failed to load baker profile");
      } finally {
        setLoading(false);
      }
    };

    loadBakerData();
  }, [bakerId]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const updated = await updateBakerProfile(bakerId, editFormData);
      setBakerData(updated);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e, imageKey) => {
    const file = e.target.files[0];
    if (file) {
      setProductImageFiles((prev) => ({
        ...prev,
        [imageKey]: file,
      }));
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setUploadingImages(true);

    try {
      let image1Url = newProduct.image1_url;
      let image2Url = newProduct.image2_url;

      // Upload images if provided
      if (productImageFiles.image1) {
        image1Url = await uploadImage(
          productImageFiles.image1,
          "product-images",
          `baker-${bakerId}`,
        );
      }

      if (productImageFiles.image2) {
        image2Url = await uploadImage(
          productImageFiles.image2,
          "product-images",
          `baker-${bakerId}`,
        );
      }

      const productData = {
        ...newProduct,
        image1_url: image1Url,
        image2_url: image2Url,
        price: parseFloat(newProduct.price),
      };

      const createdProduct = await uploadProduct(productData, bakerId);
      setProducts((prev) => [...prev, createdProduct]);
      setNewProduct({
        name: "",
        price: "",
        category: "",
        description: "",
        ingredients: "",
        allergens: "",
        image1_url: "",
        image2_url: "",
      });
      setProductImageFiles({ image1: null, image2: null });
      setShowProductForm(false);
      toast.success("Product uploaded successfully!");
    } catch (error) {
      console.error("Error uploading product:", error);
      toast.error("Failed to upload product");
    } finally {
      setUploadingImages(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!bakerData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Baker profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mb-20 lg:mb-0">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {bakerData.shop_name}
              </h1>
              <p className="text-gray-600 mt-2">{bakerData.address}</p>
              {bakerData.instagram && (
                <p className="text-orange-600 mt-1">
                  <a
                    href={`https://instagram.com/${bakerData.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {bakerData.instagram}
                  </a>
                </p>
              )}
            </div>
            {isOwnProfile && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition"
              >
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>

          {/* Edit Mode */}
          {editing && editFormData && (
            <div className="mt-6 space-y-4 border-t pt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shop Name
                </label>
                <input
                  type="text"
                  name="shop_name"
                  value={editFormData.shop_name}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={editFormData.instagram}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                  <FaSave /> Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setEditFormData(bakerData);
                  }}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Products</h2>
            {isOwnProfile && (
              <button
                onClick={() => setShowProductForm(!showProductForm)}
                className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition"
              >
                <MdAdd /> Add Product
              </button>
            )}
          </div>

          {/* Add Product Form */}
          {showProductForm && isOwnProfile && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Add New Product</h3>
              <form onSubmit={handleSubmitProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newProduct.name}
                      onChange={handleProductInputChange}
                      placeholder="e.g. Chocolate Cake"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={newProduct.price}
                      onChange={handleProductInputChange}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={newProduct.category}
                      onChange={handleProductInputChange}
                      placeholder="e.g. Cakes, Pastries"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image 1
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "image1")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image 2 (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "image2")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleProductInputChange}
                    placeholder="Describe your product..."
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ingredients (comma-separated)
                    </label>
                    <textarea
                      name="ingredients"
                      value={newProduct.ingredients}
                      onChange={handleProductInputChange}
                      placeholder="e.g. flour, sugar, eggs"
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allergens (comma-separated)
                    </label>
                    <textarea
                      name="allergens"
                      value={newProduct.allergens}
                      onChange={handleProductInputChange}
                      placeholder="e.g. gluten, dairy, peanuts"
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={uploadingImages}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {uploadingImages ? "Uploading..." : "Upload Product"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} onAddToCart={() => {}} />
                  {isOwnProfile && (
                    <div className="absolute top-2 right-2 space-x-1 flex">
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition text-sm"
                      >
                        ✎
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600">No products uploaded yet.</p>
              {isOwnProfile && (
                <button
                  onClick={() => setShowProductForm(true)}
                  className="text-orange-600 hover:text-orange-700 font-medium mt-2"
                >
                  Upload your first product
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BakerProfile;
