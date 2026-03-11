import React, { useState, useEffect } from "react";
import { fetchAllProducts, fetchCategories } from "../utils/dataService";
import ProductCard from "./ProductCard";
import { toast } from "react-toastify";

const Shop = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch categories and products
        const cats = await fetchCategories();
        const products = await fetchAllProducts();

        setCategories(cats.length > 0 ? cats : ["All"]);
        setAllProducts(products);

        // Set first category as active
        if (cats.length > 0) {
          setActiveCategory(cats[0]);
        } else {
          setActiveCategory("All");
        }
      } catch (error) {
        console.error("Error loading shop data:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts =
    activeCategory && activeCategory !== "All"
      ? allProducts.filter((product) => product.category === activeCategory)
      : allProducts;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Shop</h1>

      {/* Category Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-4 flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                activeCategory === category
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
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
