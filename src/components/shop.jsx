import React, { useState } from 'react';
import { products } from '../data/products';
import ProductCard from './ProductCard';

const Shop = ({ onAddToCart }) => {
    const [activeCategory, setActiveCategory] = useState('Cakes');

    const categories = ['Cakes', 'Pastries', 'Bread'];

    const filteredProducts = products.filter(product => product.category === activeCategory);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Shop</h1>

            {/* Category Navigation */}
            <div className="flex justify-center mb-8">
                <div className="flex space-x-4">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2 rounded-full font-semibold transition-colors ${activeCategory === category
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={onAddToCart}
                    />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <p className="text-center text-gray-500 mt-8">
                    No products available in this category.
                </p>
            )}
        </div>
    );
};

export default Shop;
