import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';

const ProductDetail = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center">
        <h4 className="text-xl font-semibold text-gray-600">Product not found.</h4>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <button 
        className="text-orange-500 font-semibold mb-6 hover:text-orange-600 transition underline hover:no-underline"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-96 object-cover rounded-xl shadow-lg" 
          />
        </div>
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
            <h4 className="text-2xl text-red-500 font-bold mb-4">₦{product.price}</h4>
            <p className="text-gray-600 mb-4 text-base">{product.description}</p>
            <p className="text-gray-600 mb-2 text-base"><span className="font-semibold">Ingredients:</span> {product.ingredients.join(', ')}</p>
            <p className="text-gray-600 mb-6 text-base"><span className="font-semibold">Allergens:</span> {product.allergens.join(', ')}</p>
          </div>
          <button 
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition shadow-md self-start"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
