import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchProductById } from "../utils/dataService";
import { toast } from "react-toastify";
import { FiArrowLeft, FiShoppingBag, FiInfo, FiAlertCircle } from "react-icons/fi";
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!product) return null;

  const ingredientsList = Array.isArray(product.ingredients)
    ? product.ingredients.join(", ")
    : product.ingredients || "N/A";

  const allergensList = Array.isArray(product.allergens)
    ? product.allergens.join(", ")
    : product.allergens || "None listed";

  const imageUrl = product.image1_url || product.image;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-12">
      {/* Top Navigation */}
      <div className="bg-white border-b sticky top-0 z-10 lg:static">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors font-medium"
          >
            <FiArrowLeft /> Back to Shop
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 lg:py-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left: Image Gallery/Main Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {/* Mobile Baker Card */}
            {product.baker && (
              <div className="lg:hidden p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">Baked by</p>
                  <p className="font-bold text-gray-900">{product.baker.shop_name}</p>
                </div>
                <Link 
                  to={`/baker-profile/${product.baker.id}`}
                  className="bg-white text-orange-500 px-4 py-2 rounded-xl text-sm font-bold shadow-sm"
                >
                  Visit Stall
                </Link>
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col h-full">
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase mb-3">
                  {product.category || "Cakes"}
                </span>
                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2 leading-tight">
                  {product.name}
                </h1>
                <p className="text-3xl font-bold text-orange-500">
                  ₦{product.price?.toLocaleString()}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">
                    <FiInfo className="text-orange-500" /> Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">Ingredients</h3>
                    <p className="text-sm text-gray-700 font-medium">{ingredientsList}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                    <h3 className="flex items-center gap-1 text-xs font-bold text-red-600 uppercase mb-1">
                      <FiAlertCircle /> Allergens
                    </h3>
                    <p className="text-sm text-red-700 font-medium">{allergensList}</p>
                  </div>
                </div>

                {/* Desktop Baker Info */}
                {product.baker && (
                  <div className="hidden lg:flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="h-12 w-12 rounded-full bg-orange-200 flex items-center justify-center text-orange-600 font-bold">
                      {product.baker.shop_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Seller</p>
                      <Link to={`/baker-profile/${product.baker.id}`} className="font-bold text-gray-900 hover:text-orange-500 transition-colors">
                        {product.baker.shop_name}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky/Fixed Bottom Action for Mobile, normal for Desktop */}
            <div className="mt-8">
              <button
                className="flex items-center justify-center gap-3 w-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-5 rounded-2xl font-black text-xl transition-all shadow-lg hover:shadow-orange-200 active:scale-95"
                onClick={() => {
                  onAddToCart(product);
                  toast.success("Added to cart!");
                }}
              >
                <FiShoppingBag className="text-2xl" /> Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-16 lg:mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
              You might also like
            </h2>
            <div className="h-1 flex-grow mx-4 bg-orange-100 rounded-full hidden sm:block"></div>
          </div>
          <SimilarProducts
            currentProductId={product.id}
            currentCategory={product.category}
          />
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;