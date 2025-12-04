import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from './ProductCard';

const CategoryProducts = ({ onAddToCart }) => {
  const { category } = useParams();

  // Capitalize first letter for display
  const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);

  const filteredProducts = products.filter(
    product => product.category.toLowerCase() === category.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h3 className="text-2xl font-bold my-3">{capitalizedCategory}</h3>
      {filteredProducts.length === 0 ? (
        <p className="text-gray-600 text-center">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
      <Link to="/" className="text-orange-500 underline hover:no-underline font-semibold my-3 inline-block">Back to All Products</Link>
    </div>
  );
};

export default CategoryProducts;
