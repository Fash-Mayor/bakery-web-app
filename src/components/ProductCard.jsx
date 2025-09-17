import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className='flex flex-row'>
    <div className="m-2 flex flex-col" style={{ width: '18rem' }}>
      <img src={product.image} className="" alt={product.name}/>
      <div className="">
        <h5 className="">{product.name}</h5>
        <p className="">{product.description}</p>
        <p><strong>${product.price.toFixed(2)}</strong></p>
        <button 
          className="" 
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div></div>
  );
};

export default ProductCard;
