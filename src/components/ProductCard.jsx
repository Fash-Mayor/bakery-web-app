import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  return (


     <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-72 flex flex-col mb-4">
      <img src={product.image} alt={product.name} className="h-48 max-w-full object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h5 className="text-lg font-semibold mb-2">{product.name}</h5>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-red-500 font-bold text-lg">₦{product.price}</span>
          <button 
            className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl hover:cursor-pointer hover:bg-orange-600 transition"
            onClick={() => onAddToCart(product)}
            aria-label="Add to cart"
          >
            +
          </button>
        </div>
      </div>
    </div>









    // <div className='flex flex-row'>
    // <div className="m-2 flex flex-col" style={{ width: '18rem' }}>
    //   <img src={product.image} className="" alt={product.name}/>
    //   <div className="">
    //     <h5 className="">{product.name}</h5>
    //     <p className="">{product.description}</p>
    //     <p><strong>${product.price.toFixed(2)}</strong></p>
    //     <button 
    //       className="" 
    //       onClick={() => onAddToCart(product)}
    //     >
    //       Add to Cart
    //     </button>
    //   </div>
    // </div></div>
  );
};

export default ProductCard;
