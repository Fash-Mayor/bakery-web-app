import React from 'react';
import ProductCard from './ProductCard';
import { products } from '../data/products';

const ProductCatalog = ({ onAddToCart }) => {
  return (
    <div className="d-flex flex-wrap justify-content-center">
      {products.map(product => (
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
