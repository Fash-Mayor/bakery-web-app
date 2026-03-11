import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchProductById } from "../utils/dataService";
import { toast } from "react-toastify";
import SimilarProducts from "./SimilarProducts";

const ProductDetail = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(parseInt(id));

        if (!data) {
          toast.error("Product not found");
          navigate(-1);
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Failed to load product");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center">
        <h4 className="text-xl font-semibold text-gray-600">
          Product not found.
        </h4>
      </div>
    );
  }

  // Handle both old format (ingredients/allergens as arrays) and new format (strings)
  const ingredientsList = Array.isArray(product.ingredients)
    ? product.ingredients.join(", ")
    : product.ingredients || "N/A";

  const allergensList = Array.isArray(product.allergens)
    ? product.allergens.join(", ")
    : product.allergens || "N/A";

  const imageUrl = product.image1_url || product.image;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <button
          className="text-orange-500 font-semibold mb-6 hover:text-orange-600 transition text-lg"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="md:w-1/2">
          <div className="sticky top-4">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-96 object-cover rounded-2xl shadow-2xl"
            />
            {product.baker_id && (
              <div className="mt-4 p-4 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg shadow-md">
                <p className="text-white text-sm font-semibold">Baked by</p>
                <p className="text-white font-bold text-lg">
                  {product.baker_name || "Local Baker"}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              {product.name}
            </h2>

            {product.baker && (
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Baker:</span>{" "}
                <a
                  href={`/baker-profile/${product.baker.id}`}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {product.baker.shop_name}
                </a>
              </p>
            )}

            <h4 className="text-5xl font-bold text-orange-500 mb-4">
              ₦{product.price}
            </h4>
            <p className="text-gray-600 mb-4 text-base">
              {product.description}
            </p>
            <p className="text-gray-600 mb-2 text-base">
              <span className="font-semibold">Ingredients:</span>{" "}
              {ingredientsList}
            </p>
            <p className="text-gray-600 mb-6 text-base">
              <span className="font-semibold">Allergens:</span> {allergensList}
            </p>
          </div>
          <button
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition shadow-lg text-lg"
            onClick={() => onAddToCart(product)}
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>

      {/* Add similar products section */}
      <SimilarProducts
        currentProductId={product.id}
        currentCategory={product.category}
      />
    </div>
  );
};

export default ProductDetail;
