import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Link } from 'react-router-dom';
import { products } from '../data/products';

const SimilarProducts = ({ currentProductId, currentCategory }) => {
    const [scrollIndex, setScrollIndex] = useState(0);

    // Get products from same category, excluding current product
    const similar = products.filter(
        p => p.category === currentCategory && p.id !== currentProductId
    );

    if (similar.length === 0) {
        return null; // Don't render if no similar products
    }

    const itemsPerView = 3; // Show 3 products at a time on desktop, adjust as needed
    const maxScroll = Math.max(0, similar.length - itemsPerView);

    const handlers = useSwipeable({
        onSwipedLeft: () => setScrollIndex(prev => Math.min(prev + 1, maxScroll)),
        onSwipedRight: () => setScrollIndex(prev => Math.max(prev - 1, 0)),
        trackMouse: true
    });

    return (
        <div className="mt-12 pt-8 border-t">
            <h3 className="text-2xl font-bold mb-6">Similar Products</h3>

            <div
                {...handlers}
                className="overflow-hidden"
            >
                <div
                    className="flex gap-4 transition-transform duration-300 ease-in-out"
                    style={{
                        transform: `translateX(-${scrollIndex * (100 / itemsPerView)}%)`
                    }}
                >
                    {similar.map(product => (
                        <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group"
                        >
                            <div className="relative overflow-hidden h-48">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                            </div>
                            <div className="p-4">
                                <h4 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h4>
                                <p className="text-red-500 font-bold text-lg">₦{product.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Navigation dots */}
            {maxScroll > 0 && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: maxScroll + 1 }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setScrollIndex(idx)}
                            className={`w-2 h-2 rounded-full transition ${scrollIndex === idx ? 'bg-orange-500' : 'bg-gray-300'
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Swipe hint */}
            <p className="text-center text-gray-500 text-sm mt-4">← Swipe or click dots →</p>
        </div>
    );
};

export default SimilarProducts;