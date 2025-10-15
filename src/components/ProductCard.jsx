import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-72 flex flex-col mb-4">
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} className="h-48 max-w-full object-cover" />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h5 className="text-lg font-semibold mb-2">{product.name}</h5>
        </Link>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-red-500 font-bold text-lg">₦{product.price}</span>
          <button
            className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl hover:cursor-pointer hover:bg-orange-600 transition"
            onClick={() => onAddToCart(product)}
            aria-label="Add to cart">
            +
          </button>


        </div>
      </div>
    </div>
  );
};

export default ProductCard;
