import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useState } from "react";

const ProductCard = ({ product, onAddToCart }) => {
  // Handle both old format (image) and new format (image1_url)
  const imageUrl = product.image1_url || product.image;
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden max-w-72 flex flex-col mb-4 transition duration-300 group">
      {/* Image Container */}
      <Link
        to={`/product/${product.id}`}
        className="relative overflow-hidden bg-gray-100 h-52"
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-110 transition duration-300"
        />
        <button
          className={`absolute top-3 right-3 p-2 rounded-full transition ${
            isWishlisted
              ? "bg-red-500 text-white"
              : "bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white"
          }`}
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
        >
          <FaHeart size={18} />
        </button>
      </Link>

      {/* Content Container */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
          <h5 className="text-lg font-bold mb-1 text-gray-900 line-clamp-2 hover:text-orange-600 transition">
            {product.name}
          </h5>
        </Link>
        <p className="text-gray-600 mb-3 text-sm line-clamp-2 flex-grow">
          {product.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <span className="text-xl font-bold text-orange-600">
            ₦{product.price}
          </span>
          <button
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl hover:from-orange-600 hover:to-orange-700 transition shadow-md"
            onClick={() => onAddToCart(product)}
            aria-label="Add to cart"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
