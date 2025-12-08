import ProductCard from './ProductCard';
import { products } from '../data/products';

const ProductCatalog = ({ onAddToCart, searchQuery = '' }) => {
  // normalize search
  const q = searchQuery.trim().toLowerCase();

  const filtered = q
    ? products.filter((p) => {
      const combined = `${p.name} ${p.category} ${p.description}`.toLowerCase();
      return combined.includes(q);
    })
    : products;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-6 justify-items-center">
      {filtered.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductCatalog;
